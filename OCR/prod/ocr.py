import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile, Response   
from RecognizePage import getText
from EnhanceImage import enhance

app = FastAPI()


@app.post("/")
async def ocr(img: UploadFile = File(...)):
    content_type = img.content_type
    if "image/" not in content_type:
        raise HTTPException(status_code=400, detail="Invalid file type")
    return getText(await img.read())

@app.post("/enhance/")
async def enhance(img: UploadFile = File(...)):
    content_type = img.content_type
    if "image/" not in content_type:
        raise HTTPException(status_code=400, detail="Invalid file type")
    return Response(enhance(await img.read()), media_type="image/png")

uvicorn.run(app= app, host="0.0.0.0", port=8000)