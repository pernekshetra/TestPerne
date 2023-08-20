
const imageInput = document.getElementById('imageInput');
const generateButton = document.getElementById('generateButton');
const resultContainer = document.getElementById('resultContainer');
const resultImage = document.getElementById('resultImage');
const downloadButton = document.getElementById('downloadButton');
const shareButton = document.getElementById('shareButton');

generateButton.addEventListener('click', generateProfilePic);
shareButton.addEventListener('click', shareOnWhatsApp);

function generateProfilePic() {
    const overlayRadioButtons = document.getElementsByName('overlay');
    let selectedOverlay;

    for (const radioButton of overlayRadioButtons) {
        if (radioButton.checked) {
            selectedOverlay = radioButton.value;
            break;
        }
    }

    if (!selectedOverlay) {
        alert('Please select an overlay.');
        return;
    }

    if (!imageInput.files || imageInput.files.length === 0) {
        alert('Please select your photo before generating a profile photo.');
        return;
    }

    const overlayImage = new Image();
    overlayImage.src = selectedOverlay;

    const reader = new FileReader();
    reader.onload = function(event) {
        const userImage = new Image();
        userImage.src = event.target.result;

        userImage.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = overlayImage.width;
            canvas.height = overlayImage.height;

            const context = canvas.getContext('2d');

            const overlayAspectRatio = overlayImage.width / overlayImage.height;
            const userAspectRatio = userImage.width / userImage.height;
            
            let userWidth, userHeight, userX, userY;

            if (overlayAspectRatio > userAspectRatio) {
                userWidth = overlayImage.width;
                userHeight = overlayImage.width / userAspectRatio;
                userX = 0;
                userY = (overlayImage.height - userHeight) / 2;
            } else {
                userHeight = overlayImage.height;
                userWidth = overlayImage.height * userAspectRatio;
                userY = 0;
                userX = (overlayImage.width - userWidth) / 2;
            }

            // Draw overlayImage first
            context.drawImage(overlayImage, 0, 0, overlayImage.width, overlayImage.height);
            
            // Then draw userImage with aspect fill
            context.drawImage(userImage, userX, userY, userWidth, userHeight);

            resultImage.src = canvas.toDataURL('image/png');
            resultContainer.style.display = 'block';
            downloadButton.href = canvas.toDataURL('image/png');
        };
    };

    reader.readAsDataURL(imageInput.files[0]);
}
