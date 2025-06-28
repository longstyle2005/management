'use client'
const validationIcon = (file, imageEle, errorEle) => {  
    if (!file) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Please select a icon.';
        return false;
    }
  
    // Check type
    const validImageTypes = ['image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Invalid icon type. Please select an image icon SVG.';
        return false;
    }
  
    // Check size
    const maxSizeInBytes = 20 * 1024;
    if (file.size > maxSizeInBytes) {
        imageEle.classList.add('error');
        errorEle?.classList.add('show');
        errorEle.textContent = 'Icon too large. Maximum size is 10KB.';
        return false;
    }

    imageEle.classList.remove('error');
    errorEle?.classList.remove('show');
    return true;
}

export default validationIcon;


    
