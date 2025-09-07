// مصفوفة لحفظ بيانات الوظائف
let jobs = [];

// تحميل البيانات من localStorage عند بدء الصفحة
window.addEventListener('DOMContentLoaded', function() {
    loadJobsFromStorage();
    displayJobs();
});

// إضافة مستمع للنموذج
document.getElementById('jobForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addJob();
});

// إضافة مستمع لنموذج التعديل
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updateJob();
});

// إضافة مستمعات للنوافذ المنبثقة
document.addEventListener('DOMContentLoaded', function() {
    // إغلاق نافذة الوصف
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('descriptionModal').style.display = 'none';
    });
    
    // إغلاق نافذة التعديل
    document.querySelector('.close-edit').addEventListener('click', function() {
        document.getElementById('editModal').style.display = 'none';
    });
    
    // إغلاق النوافذ عند الضغط خارجها
    window.addEventListener('click', function(event) {
        const descModal = document.getElementById('descriptionModal');
        const editModal = document.getElementById('editModal');
        
        if (event.target === descModal) {
            descModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});

// وظيفة إضافة وظيفة جديدة
function addJob() {
    const jobTitle = document.getElementById('jobTitle').value.trim();
    const sector = document.getElementById('sector').value.trim();
    const applicationDate = document.getElementById('applicationDate').value;
    const expectedResponse = document.getElementById('expectedResponse').value;
    const description = document.getElementById('description').value.trim();

    // التحقق من أن جميع الحقول مملوءة
    if (!jobTitle || !sector || !applicationDate || !expectedResponse) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    // إنشاء كائن الوظيفة الجديد
    const newJob = {
        id: Date.now(), // استخدام التوقيت كمعرف فريد
        jobTitle: jobTitle,
        sector: sector,
        applicationDate: applicationDate,
        expectedResponse: expectedResponse,
        description: description,
        createdAt: new Date().toLocaleDateString('ar-SA')
    };

    // إضافة الوظيفة للمصفوفة
    jobs.push(newJob);
    
    // حفظ البيانات في localStorage
    saveJobsToStorage();
    
    // عرض البيانات المحدثة
    displayJobs();
    
    // مسح النموذج
    clearForm();
    
    // رسالة نجاح
    showSuccessMessage('تم إضافة الطلب بنجاح!');
}

// وظيفة عرض الوظائف في الجدول
function displayJobs() {
    const tableBody = document.getElementById('jobsTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    // مسح محتوى الجدول الحالي
    tableBody.innerHTML = '';
    
    if (jobs.length === 0) {
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    // إضافة كل وظيفة للجدول
    jobs.forEach(job => {
        const row = document.createElement('tr');
        
        // اختصار الوصف للعرض في الجدول
        const shortDescription = job.description && job.description.length > 30 
            ? job.description.substring(0, 30) + '...' 
            : job.description || 'لا يوجد وصف';
        
        row.innerHTML = `
            <td>${job.jobTitle}</td>
            <td>${job.sector}</td>
            <td>${formatDate(job.applicationDate)}</td>
            <td>${formatDate(job.expectedResponse)}</td>
            <td class="description-cell" onclick="showFullDescription('${job.description || 'لا يوجد وصف'}', '${job.jobTitle}')">
                ${shortDescription}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editJob(${job.id})">
                        تعديل
                    </button>
                    <button class="delete-btn" onclick="deleteJob(${job.id})">
                        حذف
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// وظيفة عرض الوصف الكامل
function showFullDescription(description, jobTitle) {
    const modal = document.getElementById('descriptionModal');
    const fullDescriptionElement = document.getElementById('fullDescription');
    const modalTitle = modal.querySelector('h3');
    
    modalTitle.textContent = `وصف وظيفة: ${jobTitle}`;
    fullDescriptionElement.textContent = description || 'لا يوجد وصف متاح';
    modal.style.display = 'block';
}

// وظيفة فتح نافذة التعديل
function editJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    // ملء النموذج بالبيانات الحالية
    document.getElementById('editJobId').value = job.id;
    document.getElementById('editJobTitle').value = job.jobTitle;
    document.getElementById('editSector').value = job.sector;
    document.getElementById('editApplicationDate').value = job.applicationDate;
    document.getElementById('editExpectedResponse').value = job.expectedResponse;
    document.getElementById('editDescription').value = job.description || '';
    
    // عرض النافذة المنبثقة
    document.getElementById('editModal').style.display = 'block';
}

// وظيفة تحديث الوظيفة
function updateJob() {
    const jobId = parseInt(document.getElementById('editJobId').value);
    const jobTitle = document.getElementById('editJobTitle').value.trim();
    const sector = document.getElementById('editSector').value.trim();
    const applicationDate = document.getElementById('editApplicationDate').value;
    const expectedResponse = document.getElementById('editExpectedResponse').value;
    const description = document.getElementById('editDescription').value.trim();
    
    // التحقق من أن جميع الحقول المطلوبة مملوءة
    if (!jobTitle || !sector || !applicationDate || !expectedResponse) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // العثور على الوظيفة وتحديثها
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
        jobs[jobIndex] = {
            ...jobs[jobIndex],
            jobTitle: jobTitle,
            sector: sector,
            applicationDate: applicationDate,
            expectedResponse: expectedResponse,
            description: description,
            updatedAt: new Date().toLocaleDateString('ar-SA')
        };
        
        // حفظ البيانات وإعادة العرض
        saveJobsToStorage();
        displayJobs();
        closeEditModal();
        showSuccessMessage('تم تحديث الطلب بنجاح!');
    }
}

// وظيفة إغلاق نافذة التعديل
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// وظيفة حذف وظيفة
function deleteJob(jobId) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        jobs = jobs.filter(job => job.id !== jobId);
        saveJobsToStorage();
        displayJobs();
        showSuccessMessage('تم حذف الطلب بنجاح!');
    }
}

// وظيفة حفظ البيانات في localStorage
function saveJobsToStorage() {
    try {
        localStorage.setItem('jobApplications', JSON.stringify(jobs));
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        alert('حدث خطأ في حفظ البيانات');
    }
}

// وظيفة تحميل البيانات من localStorage
function loadJobsFromStorage() {
    try {
        const savedJobs = localStorage.getItem('jobApplications');
        if (savedJobs) {
            jobs = JSON.parse(savedJobs);
        }
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        jobs = [];
    }
}

// وظيفة مسح النموذج
function clearForm() {
    document.getElementById('jobForm').reset();
}

// وظيفة تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// وظيفة عرض رسالة النجاح
function showSuccessMessage(message) {
    // إنشاء عنصر الرسالة
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        z-index: 1000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // إضافة الرسالة للصفحة
    document.body.appendChild(messageDiv);
    
    // تحريك الرسالة للداخل
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // إزالة الرسالة بعد 3 ثوانِ
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// إضافة تأثيرات تفاعلية للأزرار
document.addEventListener('DOMContentLoaded', function() {
    // تأثير الضغط على الأزرار
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            e.target.style.transform = 'scale(0.98)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }
    });
});