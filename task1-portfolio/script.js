// Basic JS for small UX touches

document.addEventListener('DOMContentLoaded', () => {
  const contactBtn = document.getElementById('contact-btn');
  const toast = document.getElementById('toast');
  const downloadBtn = document.getElementById('download-cv');

  // Show toast helper
  function showToast(msg, ms = 1600) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, ms);
  }

  // If contact is clicked, show small toast (mailto still opens)
  contactBtn.addEventListener('click', () => {
    showToast('Opening email client...');
    // mailto href handles email client opening
  });

  // Download CV behavior: if there is a file named 'CV.pdf' in folder it triggers; otherwise show toast
  downloadBtn.addEventListener('click', () => {
    const cvUrl = 'CV.pdf';
    fetch(cvUrl, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          window.location.href = cvUrl;
        } else {
          showToast('No CV found. Place CV.pdf in the folder to enable download.');
        }
      })
      .catch(() => showToast('No CV found. Place CV.pdf in the folder to enable download.'));
  });
});
