from ml.models.vqa.wrapper import run_vqa


cases = [
    ("data/demo/before.png", "What is visible in the image?"),
    ("data/demo/after.png", "What is visible in the image?"),
    ("data/demo/after2.png", "What type of land cover is present?"),
    ("data/demo/water_test.png", "Is there water in the image?"),
]


for image_path, question in cases:
    print(f"\nImage: {image_path}")
    print(f"Question: {question}")

    result = run_vqa(
        image=image_path,
        query=question,
    )

    print(f"Answer: {result['answer']}")
    print(f"Model: {result['model']}")