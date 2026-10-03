from pathlib import Path
from PIL import Image
import io,json,struct
root=Path('public')
for name in ['blueberry-wet','all-six-front','berries','macro','floating']:
    src=root/'media'/f'{name}.png'
    image=Image.open(src)
    image.thumbnail((1600,1600))
    image.save(src.with_suffix('.webp'),'WEBP',quality=84,method=6)
    print(name,src.stat().st_size,src.with_suffix('.webp').stat().st_size)
out=root/'models'/'web';out.mkdir(exist_ok=True)
for src in (root/'models').glob('*_dry.glb'):
    data=src.read_bytes();size=struct.unpack_from('<I',data,12)[0];doc=json.loads(data[20:20+size]);binary=data[28+size:]
    replacements={}
    for image in doc.get('images',[]):
        view=doc['bufferViews'][image['bufferView']];offset=view.get('byteOffset',0)
        im=Image.open(io.BytesIO(binary[offset:offset+view['byteLength']])).convert('RGB');im.thumbnail((1024,1024))
        b=io.BytesIO();im.save(b,'JPEG',quality=88,optimize=True)
        replacements[image['bufferView']]=b.getvalue();image['mimeType']='image/jpeg'
    # Core JPEG images no longer require EXT_texture_webp.
    for texture in doc.get('textures',[]):
        ext=texture.get('extensions',{}).pop('EXT_texture_webp',None)
        if ext: texture['source']=ext['source']
    for key in ['extensionsUsed','extensionsRequired']:
        if key in doc: doc[key]=[e for e in doc[key] if e!='EXT_texture_webp']
    rebuilt=bytearray()
    for i,view in enumerate(doc['bufferViews']):
        offset=view.get('byteOffset',0);chunk=replacements.get(i,binary[offset:offset+view['byteLength']])
        while len(rebuilt)%4:rebuilt.append(0)
        view['byteOffset']=len(rebuilt);view['byteLength']=len(chunk);rebuilt.extend(chunk)
    while len(rebuilt)%4:rebuilt.append(0)
    doc['buffers'][0]['byteLength']=len(rebuilt)
    encoded=json.dumps(doc,separators=(',',':')).encode();encoded+=b' '*((-len(encoded))%4)
    result=struct.pack('<III',0x46546c67,2,28+len(encoded)+len(rebuilt))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(rebuilt),0x004e4942)+rebuilt
    (out/src.name).write_bytes(result)
    print(src.name,len(data),len(result))
