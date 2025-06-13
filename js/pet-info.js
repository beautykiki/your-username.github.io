// DOM元素
const petForm = document.getElementById('pet-form');
const petDisplay = document.getElementById('pet-display');
const petFormContainer = document.getElementById('pet-form-container');
const avatarUpload = document.getElementById('avatar-upload');
const uploadBtn = document.getElementById('upload-btn');
const avatarPreview = document.getElementById('avatar-preview');
const petAvatarDisplay = document.getElementById('pet-avatar-display');
const petNameDisplay = document.getElementById('pet-name-display');
const petAgeDisplay = document.getElementById('pet-age-display');
const togetherDaysDisplay = document.getElementById('together-days-display');
const statusOptions = document.querySelectorAll('.status-option');
const petStatus = document.getElementById('pet-status');

// 检查本地存储中是否有宠物信息
const petData = localStorage.getItem('petData');

if (petData) {
    // 如果有宠物信息，显示宠物信息
    displayPetInfo(JSON.parse(petData));
} else {
    // 如果没有宠物信息，显示表单
    petDisplay.classList.add('hidden');
    petFormContainer.classList.remove('hidden');
}

// 上传按钮点击事件
uploadBtn.addEventListener('click', function() {
    avatarUpload.click();
});

// 头像上传预览
avatarUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('请上传图片文件（支持 JPG、PNG、GIF、WEBP 格式）');
            return;
        }
        
        // 验证文件大小（限制为 5MB）
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('图片大小不能超过 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            avatarPreview.innerHTML = `<img src="${event.target.result}" alt="头像预览">`;
        }
        reader.onerror = function() {
            alert('图片读取失败，请重试');
        }
        reader.readAsDataURL(file);
    }
});

// 宠物状态选择
statusOptions.forEach(option => {
    option.addEventListener('click', function() {
        statusOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        petStatus.value = this.dataset.status;
    });
});

// 默认选择"在身边"状态
document.querySelector('[data-status="with-me"]').classList.add('active');

// 日期格式验证函数
function isValidDateFormat(dateStr) {
    const regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (!regex.test(dateStr)) return false;
    
    const [year, month, day] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
}

// 表单提交
petForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 验证日期格式
    const birthDate = document.getElementById('birth-date').value;
    const adoptDate = document.getElementById('adopt-date').value;
    
    if (!isValidDateFormat(birthDate)) {
        alert('请按照正确的格式输入出生日期（年/月/日）');
        return;
    }
    
    if (!isValidDateFormat(adoptDate)) {
        alert('请按照正确的格式输入到家日期（年/月/日）');
        return;
    }
    
    // 获取头像数据
    const avatarImg = avatarPreview.querySelector('img');
    const avatarSrc = avatarImg ? avatarImg.src : '';
    
    // 获取表单数据
    const petData = {
        name: document.getElementById('pet-name').value,
        type: document.getElementById('pet-type').value,
        breed: document.getElementById('pet-breed').value,
        status: petStatus.value,
        birthDate: birthDate,
        adoptDate: adoptDate,
        avatar: avatarSrc
    };
    
    // 保存到本地存储
    localStorage.setItem('petData', JSON.stringify(petData));
    
    // 显示宠物信息
    displayPetInfo(petData);
});

// 点击头像编辑信息
petAvatarDisplay.addEventListener('click', function() {
    // 显示表单，隐藏展示区域
    petDisplay.classList.add('hidden');
    petFormContainer.classList.remove('hidden');
    
    // 加载现有数据到表单
    const petData = JSON.parse(localStorage.getItem('petData'));
    if (petData) {
        document.getElementById('pet-name').value = petData.name;
        document.getElementById('pet-type').value = petData.type;
        document.getElementById('pet-breed').value = petData.breed;
        document.getElementById('birth-date').value = petData.birthDate;
        document.getElementById('adopt-date').value = petData.adoptDate;
        petStatus.value = petData.status;
        
        // 设置状态选项
        statusOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`[data-status="${petData.status}"]`).classList.add('active');
        
        // 设置头像预览
        if (petData.avatar) {
            avatarPreview.innerHTML = `<img src="${petData.avatar}" alt="头像预览">`;
        } else {
            avatarPreview.innerHTML = '<i class="fas fa-camera"></i>';
        }
    }
});

// 显示宠物信息
function displayPetInfo(petData) {
    // 显示展示区域，隐藏表单
    petDisplay.classList.remove('hidden');
    petFormContainer.classList.add('hidden');
    
    // 填充数据
    petNameDisplay.textContent = petData.name || '未命名';
    
    if (petData.avatar) {
        petAvatarDisplay.innerHTML = `<img src="${petData.avatar}" alt="宠物头像">`;
        petAvatarDisplay.innerHTML += `<div class="edit-overlay">
            <i class="fas fa-edit"></i>
            <span>编辑信息</span>
        </div>`;
    } else {
        // 根据类型显示默认图标
        let iconClass = 'fas fa-paw';
        if (petData.type === 'cat') iconClass = 'fas fa-cat';
        if (petData.type === 'dog') iconClass = 'fas fa-dog';
        
        petAvatarDisplay.innerHTML = `<i class="${iconClass}"></i>`;
        petAvatarDisplay.innerHTML += `<div class="edit-overlay">
            <i class="fas fa-edit"></i>
            <span>编辑信息</span>
        </div>`;
    }
    
    // 计算年龄和相伴天数
    if (petData.birthDate && petData.adoptDate) {
        const [birthYear, birthMonth, birthDay] = petData.birthDate.split('/').map(Number);
        const [adoptYear, adoptMonth, adoptDay] = petData.adoptDate.split('/').map(Number);
        
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
        const adoptDate = new Date(adoptYear, adoptMonth - 1, adoptDay);
        const today = new Date();
        
        // 计算年龄（年）
        const ageDiff = today - birthDate;
        const ageDate = new Date(ageDiff);
        const ageYears = ageDate.getUTCFullYear() - 1970;
        const ageMonths = ageDate.getUTCMonth();
        
        let ageDisplay;
        if (ageYears > 0) {
            ageDisplay = `${ageYears}岁${ageMonths}个月`;
        } else {
            ageDisplay = `${ageMonths}个月`;
        }
        
        petAgeDisplay.textContent = ageDisplay;
        
        // 计算相伴天数
        const togetherDays = Math.floor((today - adoptDate) / (1000 * 60 * 60 * 24));
        togetherDaysDisplay.textContent = `${togetherDays}天`;
    } else {
        petAgeDisplay.textContent = '未知';
        togetherDaysDisplay.textContent = '未知';
    }
} 