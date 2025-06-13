// 宠物信息管理
document.addEventListener('DOMContentLoaded', function() {
    const petForm = document.getElementById('pet-form');
    const petDisplay = document.getElementById('pet-display');
    const petFormContainer = document.getElementById('pet-form-container');
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    const petAvatarDisplay = document.getElementById('pet-avatar-display');
    const statusOptions = document.querySelectorAll('.status-option');
    const petStatus = document.getElementById('pet-status');

    // 初始化显示
    function initDisplay() {
        const petInfo = JSON.parse(localStorage.getItem('pet-info'));
        if (petInfo) {
            updatePetDisplay(petInfo);
            if (petFormContainer) petFormContainer.style.display = 'none';
            if (petDisplay) petDisplay.style.display = 'block';
        } else {
            if (petFormContainer) petFormContainer.style.display = 'block';
            if (petDisplay) petDisplay.style.display = 'none';
        }
    }

    // 更新宠物信息显示
    function updatePetDisplay(petInfo) {
        const nameDisplay = document.getElementById('pet-name-display');
        const ageDisplay = document.getElementById('pet-age-display');
        const daysDisplay = document.getElementById('together-days-display');
        
        if (nameDisplay) nameDisplay.textContent = petInfo.name || '未命名';
        if (ageDisplay) ageDisplay.textContent = calculateAge(petInfo.birthDate) + '岁';
        if (daysDisplay) daysDisplay.textContent = calculateTogetherDays(petInfo.adoptDate) + '天';
        
        if (petInfo.avatar && petAvatarDisplay) {
            petAvatarDisplay.style.backgroundImage = `url(${petInfo.avatar})`;
            const icon = petAvatarDisplay.querySelector('i');
            if (icon) icon.style.display = 'none';
        }
    }

    // 计算年龄
    function calculateAge(birthDate) {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const monthDiff = now.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    // 计算相伴天数
    function calculateTogetherDays(adoptDate) {
        if (!adoptDate) return 0;
        const adopt = new Date(adoptDate);
        const now = new Date();
        const diffTime = Math.abs(now - adopt);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 头像上传
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && avatarPreview) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.style.backgroundImage = `url(${e.target.result})`;
                    const icon = avatarPreview.querySelector('i');
                    if (icon) icon.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 状态选择
    if (statusOptions.length > 0) {
        statusOptions.forEach(option => {
            option.addEventListener('click', function() {
                statusOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                if (petStatus) petStatus.value = this.dataset.status;
            });
        });
    }

    // 表单提交
    if (petForm) {
        petForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const petInfo = {
                name: document.getElementById('pet-name')?.value || '',
                type: document.getElementById('pet-type')?.value || '',
                breed: document.getElementById('pet-breed')?.value || '',
                status: petStatus?.value || 'with-me',
                birthDate: document.getElementById('birth-date')?.value || '',
                adoptDate: document.getElementById('adopt-date')?.value || '',
                avatar: avatarPreview?.style.backgroundImage?.slice(4, -1).replace(/"/g, "") || ''
            };

            localStorage.setItem('pet-info', JSON.stringify(petInfo));
            updatePetDisplay(petInfo);
            
            if (petFormContainer) petFormContainer.style.display = 'none';
            if (petDisplay) petDisplay.style.display = 'block';
        });
    }

    // 编辑按钮点击事件
    if (petAvatarDisplay) {
        petAvatarDisplay.addEventListener('click', function() {
            if (petFormContainer) petFormContainer.style.display = 'block';
            if (petDisplay) petDisplay.style.display = 'none';
            
            // 填充表单
            const petInfo = JSON.parse(localStorage.getItem('pet-info'));
            if (petInfo) {
                const nameInput = document.getElementById('pet-name');
                const typeInput = document.getElementById('pet-type');
                const breedInput = document.getElementById('pet-breed');
                const birthDateInput = document.getElementById('birth-date');
                const adoptDateInput = document.getElementById('adopt-date');

                if (nameInput) nameInput.value = petInfo.name || '';
                if (typeInput) typeInput.value = petInfo.type || '';
                if (breedInput) breedInput.value = petInfo.breed || '';
                if (birthDateInput) birthDateInput.value = petInfo.birthDate || '';
                if (adoptDateInput) adoptDateInput.value = petInfo.adoptDate || '';
                if (petStatus) petStatus.value = petInfo.status || 'with-me';
                
                statusOptions.forEach(opt => {
                    if (opt.dataset.status === petInfo.status) {
                        opt.classList.add('active');
                    } else {
                        opt.classList.remove('active');
                    }
                });

                if (petInfo.avatar && avatarPreview) {
                    avatarPreview.style.backgroundImage = `url(${petInfo.avatar})`;
                    const icon = avatarPreview.querySelector('i');
                    if (icon) icon.style.display = 'none';
                }
            }
        });
    }

    // 初始化显示
    initDisplay();
}); 