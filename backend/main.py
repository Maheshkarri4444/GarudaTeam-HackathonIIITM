# import os
# import uuid
# import cv2
# import numpy as np
# from fastapi import FastAPI, File, UploadFile, Form
# from fastapi.responses import StreamingResponse
# import mimetypes
# from starlette.background import BackgroundTask
# from ultralytics import YOLO
# from ultralytics import SAM
# from fastapi.middleware.cors import CORSMiddleware



# # === Constants ===
# INPUT_DIR = "inputs"
# OUTPUT_DIR = "outputs"
# MODEL_DIR = "models"
# SAM_MODEL_PATH = "sam/sam2_b.pt"
# # SAM_MODEL_PATH = SAM('sam2_b.pt')

# MODELS = {
#     "Army": os.path.join(MODEL_DIR, "army.pt"),
#     "Navy": os.path.join(MODEL_DIR, "navy.pt"),
#     "Airforce": os.path.join(MODEL_DIR, "airforce.pt")
# }

# # === App setup ===
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change this to only your frontend origin in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# os.makedirs(INPUT_DIR, exist_ok=True)
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # === ImageProcessor Class ===
# class ImageProcessor:
#     def __init__(self, yolo_path: str, sam_path: str):
#         self.yolo_model = YOLO(yolo_path)
#         self.sam_model = SAM(sam_path)

#     def process_video(self, video_path: str, output_path: str):
#         cap = cv2.VideoCapture(video_path)
#         if not cap.isOpened():
#             raise Exception("Could not open video")

#         fps = cap.get(cv2.CAP_PROP_FPS)
#         w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#         h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#         out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

#         while cap.isOpened():
#             ret, frame = cap.read()
#             if not ret:
#                 break

#             results_yolo = self.yolo_model(frame)
#             boxes_yolo = []
#             for result in results_yolo:
#                 class_ids = result.boxes.cls.int().tolist()
#                 if class_ids:
#                     boxes_yolo.extend(result.boxes.xyxy.tolist())

#             results_sam = None
#             if boxes_yolo:
#                 results_sam = self.sam_model(frame, bboxes=boxes_yolo, verbose=False, save=False, device="cpu")

#             frame_plot = results_yolo[0].plot()
#             if results_sam and results_sam[0].masks is not None:
#                 masks = results_sam[0].masks.data.cpu().numpy()
#                 combined_mask = np.zeros_like(frame[:, :, 0], dtype=np.uint8)
#                 for mask in masks:
#                     combined_mask = np.maximum(combined_mask, (mask * 255).astype(np.uint8))
#                 masked_frame = frame.copy()
#                 masked_frame[combined_mask > 0] = [0, 255, 0]
#                 frame_plot = cv2.addWeighted(frame_plot, 0.7, masked_frame, 0.3, 0)

#             out.write(frame_plot)

#         cap.release()
#         out.release()

# # === API Routes ===

# @app.post("/process")
# async def process_file(mode: str = Form(...), file: UploadFile = File(...)):
#     assert mode in MODELS, "Invalid mode"

#     # Save uploaded file
#     file_id = str(uuid.uuid4())
#     input_path = os.path.join(INPUT_DIR, f"{file_id}_{file.filename}")
#     output_path = os.path.join(OUTPUT_DIR, f"{file_id}_processed.mp4")

#     with open(input_path, "wb") as f:
#         f.write(await file.read())

#     # Process video
#     processor = ImageProcessor(MODELS[mode], SAM_MODEL_PATH)
#     processor.process_video(input_path, output_path)

#     return {"output_path": output_path.split("/")[-1]}





# @app.get("/download/{filename}")
# def download_file(filename: str):
#     file_path = os.path.join(OUTPUT_DIR, filename)

#     # Guess the correct MIME type based on file extension
#     mime_type, _ = mimetypes.guess_type(file_path)
#     if not mime_type:
#         mime_type = "application/octet-stream"  # fallback

#     def iterfile():
#         with open(file_path, mode="rb") as file_like:
#             yield from file_like

#     return StreamingResponse(
#         iterfile(),
#         media_type=mime_type,
#         headers={
#             "Content-Disposition": f'inline; filename="{filename}"',
#             "Accept-Ranges": "bytes",  # allow partial content for streaming
#             "Cache-Control": "no-cache"
#         }
#     )


# @app.get("/video/{filename}")
# def get_video(filename: str):
#     video_path = os.path.join("outputs", filename)

#     def iterfile():
#         with open(video_path, mode="rb") as file_like:
#             yield from file_like

#     return StreamingResponse(
#         iterfile(),
#         media_type="video/mp4",  # You can change this based on your format
#         headers={
#             "Content-Disposition": f'inline; filename="{filename}"',
#             "Accept-Ranges": "bytes"
#         }
#     )


import os
import uuid
import cv2
import numpy as np
import imageio
import mimetypes
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO, SAM

# === Constants ===
INPUT_DIR = "inputs"
OUTPUT_DIR = "outputs"
MODEL_DIR = "models"
SAM_MODEL_PATH = "sam/sam2_b.pt"

MODELS = {
    "Army": os.path.join(MODEL_DIR, "army.pt"),
    "Navy": os.path.join(MODEL_DIR, "navy.pt"),
    "Airforce": os.path.join(MODEL_DIR, "airforce.pt")
}

# === App setup ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# === ImageProcessor Class ===
class ImageProcessor:
    def __init__(self, yolo_path: str, sam_path: str):
        self.yolo_model = YOLO(yolo_path)
        self.sam_model = SAM(sam_path)

    def process_video(self, video_path: str, output_path: str):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Could not open video")

        fps = cap.get(cv2.CAP_PROP_FPS)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results_yolo = self.yolo_model(frame)
            boxes_yolo = []
            for result in results_yolo:
                class_ids = result.boxes.cls.int().tolist()
                if class_ids:
                    boxes_yolo.extend(result.boxes.xyxy.tolist())

            results_sam = None
            if boxes_yolo:
                results_sam = self.sam_model(frame, bboxes=boxes_yolo, verbose=False, save=False, device="cpu")

            frame_plot = results_yolo[0].plot()
            if results_sam and results_sam[0].masks is not None:
                masks = results_sam[0].masks.data.cpu().numpy()
                combined_mask = np.zeros_like(frame[:, :, 0], dtype=np.uint8)
                for mask in masks:
                    combined_mask = np.maximum(combined_mask, (mask * 255).astype(np.uint8))
                masked_frame = frame.copy()
                masked_frame[combined_mask > 0] = [0, 255, 0]
                frame_plot = cv2.addWeighted(frame_plot, 0.7, masked_frame, 0.3, 0)

            out.write(frame_plot)

        cap.release()
        out.release()

    def convert_to_gif(self, video_path: str, gif_path: str):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Failed to open video for GIF conversion")

        fps = cap.get(cv2.CAP_PROP_FPS)
        frames = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(rgb)

        cap.release()

        imageio.mimsave(gif_path, frames, fps=int(fps))


# === Routes ===
@app.post("/process")
async def process_file(mode: str = Form(...), file: UploadFile = File(...)):
    assert mode in MODELS, "Invalid mode"

    file_id = str(uuid.uuid4())
    filename_base = f"{file_id}_{file.filename.rsplit('.', 1)[0]}"
    input_path = os.path.join(INPUT_DIR, f"{filename_base}.mp4")
    output_video = os.path.join(OUTPUT_DIR, f"{filename_base}_processed.mp4")
    output_gif = os.path.join(OUTPUT_DIR, f"{filename_base}_processed.gif")

    # Save input video
    with open(input_path, "wb") as f:
        f.write(await file.read())

    # Process video and convert to GIF
    processor = ImageProcessor(MODELS[mode], SAM_MODEL_PATH)
    processor.process_video(input_path, output_video)
    processor.convert_to_gif(output_video, output_gif)

    return {
        "gif_path": os.path.basename(output_gif),
        "mp4_path": os.path.basename(output_video)
    }


@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type:
        mime_type = "application/octet-stream"

    def iterfile():
        with open(file_path, mode="rb") as file_like:
            yield from file_like

    return StreamingResponse(
        iterfile(),
        media_type=mime_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache",
            "Accept-Ranges": "bytes"
        }
    )
