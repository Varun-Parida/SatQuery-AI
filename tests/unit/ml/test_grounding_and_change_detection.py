from ml.models.change_detection.wrapper import run_change_detection
from ml.models.grounding.wrapper import run_grounding


def test_water_grounding_returns_a_bounding_box():
    image = [[[45, 160, 65] for _ in range(8)] for _ in range(8)]
    for y in range(3, 5):
        for x in range(2, 6):
            image[y][x] = [20, 70, 180]

    result = run_grounding(image, "Where is the water body?")

    assert result["boxes"] == [{"x": 2, "y": 3, "width": 4, "height": 2}]
    assert result["confidence"] > 0


def test_change_detection_returns_regions_and_binary_map():
    before = [[[30, 130, 40] for _ in range(8)] for _ in range(8)]
    after = [[[30, 130, 40] for _ in range(8)] for _ in range(8)]
    for y in range(1, 4):
        for x in range(4, 7):
            after[y][x] = [220, 45, 45]

    result = run_change_detection(before, after)

    assert result["changed"] is True
    assert result["change_regions"] == [{"x": 4, "y": 1, "width": 3, "height": 3}]
    assert result["change_map"][1][4] == 255
    assert result["change_map"][0][0] == 0
