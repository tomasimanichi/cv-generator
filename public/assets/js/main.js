// Validação de formulário usando estilo do Bootstrap
(function() {
	'use strict';
	window.addEventListener('load', function() {
		// Buscar todos os formulários que precisam de validação
		var forms = document.getElementsByClassName('needs-validation');

		// Aplicar listener de submit para cada formulário
		Array.prototype.forEach.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}
				// Adiciona classe para mostrar feedback do bootstrap
				form.classList.add('was-validated');
			}, false);
		});
	}, false);
})();

document.addEventListener('input', function (e) {
	var target = e.target;
	if (!target || !target.matches || !target.matches('input[type="tel"]')) return;

	var value = target.value.replace(/\D/g, '');

	if (value.length > 10) {
		// Celular: (99) 99999-9999
		value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
	} else if (value.length > 6) {
		// Fixo: (99) 9999-9999
		value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
	} else if (value.length > 2) {
		// Apenas DDD
		value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
	}

	target.value = value;
}, false);

// Funções e event listeners do formulário
document.addEventListener('DOMContentLoaded', function() {
    // Submit do formulário para gerar PDF
    const form = document.getElementById('curriculo-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulário antes de enviar
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }
        
        const formData = new FormData(this);
        
        // Debug: verificar dados do formulário
        console.log('Enviando dados do formulário...');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        try {
            showNotification('Gerando PDF...', 'success');
            
            // Construir URL correta
            let url;
            if (window.location.protocol === 'file:') {
                // Se estiver acessando via file://, usar localhost
                url = 'http://localhost/cv-generator/public/generate.php';
                console.warn('Detectado protocolo file://. Usando:', url);
                console.warn('IMPORTANTE: Acesse via http://localhost/cv-generator/public/index.html');
            } else {
                // Se estiver acessando via http://, usar caminho relativo
                url = 'generate.php';
            }
            
            console.log('URL de destino:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            
            console.log('Resposta recebida:', response.status, response.statusText);
            console.log('Content-Type:', response.headers.get('content-type'));
            
            if (response.ok && response.headers.get('content-type')?.includes('application/pdf')) {
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'curriculo_' + new Date().toISOString().split('T')[0] + '.pdf';
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
                
                showNotification('PDF gerado com sucesso!', 'success');
            } else {
                const contentType = response.headers.get('content-type');
                let errorMsg = 'Erro ao gerar PDF';
                
                try {
                    if (contentType && contentType.includes('application/json')) {
                        const error = await response.json();
                        errorMsg = error.erros ? error.erros.join('\n') : error.erro || errorMsg;
                    } else {
                        const text = await response.text();
                        console.error('Resposta do servidor:', text);
                        errorMsg = 'Erro no servidor. Verifique o console para detalhes.';
                    }
                } catch (parseError) {
                    console.error('Erro ao processar resposta:', parseError);
                }
                
                showNotification(errorMsg, 'error');
            }
        } catch (erro) {
            console.error('Erro detalhado:', erro);
            showNotification('Erro de conexão: ' + erro.message + '. Verifique se o servidor está rodando.', 'error');
        }
    });

    // Botões de navegação
    const btnNextToExperience = document.getElementById('btnNextToExperience');
    const btnBackToPersonal = document.getElementById('btnBackToPersonal');
    const btnNextToReferences = document.getElementById('btnNextToReferences');
    const btnBackToExperience = document.getElementById('btnBackToExperience');
    const btnNextToPreview = document.getElementById('btnNextToPreview');
    const btnBackToReferences = document.getElementById('btnBackToReferences');
    const backToFormBtn = document.getElementById('backToFormBtn');

    // Tabs
    const personalTab = new bootstrap.Tab(document.getElementById('personal-tab'));
    const experienceTab = new bootstrap.Tab(document.getElementById('experience-tab'));
    const referencesTab = new bootstrap.Tab(document.getElementById('references-tab'));
    const previewTab = new bootstrap.Tab(document.getElementById('preview-tab'));

    // Navegação: Dados Pessoais -> Experiências (com validação)
    if (btnNextToExperience) {
        btnNextToExperience.addEventListener('click', function() {
            if (validateCurrentTab('personal')) {
                experienceTab.show();
            }
        });
    }

    // Navegação: Experiências -> Dados Pessoais
    if (btnBackToPersonal) {
        btnBackToPersonal.addEventListener('click', function() {
            personalTab.show();
        });
    }

    // Navegação: Experiências -> Referências
    if (btnNextToReferences) {
        btnNextToReferences.addEventListener('click', function() {
            referencesTab.show();
        });
    }

    // Navegação: Referências -> Experiências
    if (btnBackToExperience) {
        btnBackToExperience.addEventListener('click', function() {
            experienceTab.show();
        });
    }

    // Navegação: Referências -> Preview (com validação e atualização)
    if (btnNextToPreview) {
        btnNextToPreview.addEventListener('click', function() {
            // Validar campos obrigatórios antes de mostrar preview
            if (validateForm()) {
                updatePreview();
                previewTab.show();
            }
        });
    }

    // Navegação: Preview -> Referências
    if (btnBackToReferences) {
        btnBackToReferences.addEventListener('click', function() {
            referencesTab.show();
        });
    }

    // Botão "Voltar ao Formulário" na aba de preview
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', function() {
            personalTab.show();
        });
    }
});

// Função para exibir notificações
function showNotification(msg, type) {
    const toastEl = document.getElementById('toastNotification');
    const toastBody = document.getElementById('toastBody');
    const toastTitle = document.getElementById('toastTitle');
    const toastIcon = document.getElementById('toastIcon');
    
    toastBody.textContent = msg;
    
    if (type === 'success') {
        toastTitle.textContent = 'Sucesso';
        toastIcon.className = 'bi bi-check-circle-fill text-success me-2';
    } else {
        toastTitle.textContent = 'Erro';
        toastIcon.className = 'bi bi-exclamation-circle-fill text-danger me-2';
    }
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Função para validar aba atual
function validateCurrentTab(tabId) {
    const tab = document.getElementById(tabId);
    const requiredInputs = tab.querySelectorAll('[required]');
    let isValid = true;
    const form = document.getElementById('curriculo-form');

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    if (!isValid) {
        form.classList.add('was-validated');
        showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
    }

    return isValid;
}

// Função para validar todo o formulário
function validateForm() {
    const form = document.getElementById('curriculo-form');
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });

    if (!isValid) {
        form.classList.add('was-validated');
        showNotification('Por favor, preencha todos os campos obrigatórios antes de visualizar!', 'error');
    }

    return isValid;
}

// Função para atualizar preview do currículo
function updatePreview() {
    console.log('updatePreview() chamada');
    const previewDiv = document.getElementById('cvPreview');
    
    if (!previewDiv) {
        console.error('Elemento cvPreview não encontrado!');
        return;
    }
    
    // Coletar dados do formulário
    const fullName = document.getElementById('fullName').value || '';
    const dob = document.getElementById('dob').value || '';
    const age = document.getElementById('age').value || '';
    const email = document.getElementById('email').value || '';
    const phone = document.getElementById('phone').value || '';
    const address = document.getElementById('address').value || '';
    const objective = document.getElementById('objective').value || '';

    console.log('Dados coletados:', { fullName, email, phone });

    // Coletar formação acadêmica
    let educationHTML = '';
    const educationGroups = document.querySelectorAll('.education-group');
    educationGroups.forEach(group => {
        const courseInput = group.querySelector('input[name="course[]"]');
        const institutionInput = group.querySelector('input[name="institution[]"]');
        const levelSelect = group.querySelector('select[name="education_level[]"]');
        const eduStartInput = group.querySelector('input[name="edu_start[]"]');
        const eduEndInput = group.querySelector('input[name="edu_end[]"]');
        const graduationYearInput = group.querySelector('input[name="graduation_year[]"]');
        
        const course = courseInput ? courseInput.value || '' : '';
        const institution = institutionInput ? institutionInput.value || '' : '';
        const level = levelSelect ? levelSelect.value || '' : '';
        const eduStart = eduStartInput ? eduStartInput.value || '' : '';
        const eduEnd = eduEndInput ? eduEndInput.value || '' : '';
        const graduationYear = graduationYearInput ? graduationYearInput.value || '' : '';
        
        if (course || institution) {
            const displayLevel = level ? ' - ' + level.charAt(0).toUpperCase() + level.slice(1) : '';
            const displayYear = graduationYear ? ` (${graduationYear})` : '';
            educationHTML += `
                <div class="mb-3">
                    <h6 class="fw-bold">${course}</h6>
                    <p class="mb-1">${institution}${displayLevel}${displayYear}</p>
                </div>
            `;
        }
    });

    // Coletar experiências profissionais
    let experiencesHTML = '';
    const experienceGroups = document.querySelectorAll('.experience-group');
    experienceGroups.forEach(group => {
        const companyInput = group.querySelector('input[name="company[]"]');
        const positionInput = group.querySelector('input[name="position[]"]');
        const expStartInput = group.querySelector('input[name="exp_start[]"]');
        const expEndInput = group.querySelector('input[name="exp_end[]"]');
        const descriptionTextarea = group.querySelector('textarea[name="exp_description[]"]');
        
        const company = companyInput ? companyInput.value || '' : '';
        const position = positionInput ? positionInput.value || '' : '';
        const expStart = expStartInput ? expStartInput.value || '' : '';
        const expEnd = expEndInput ? expEndInput.value || '' : '';
        const description = descriptionTextarea ? descriptionTextarea.value || '' : '';
        
        if (company || position) {
            experiencesHTML += `
                <div class="mb-3">
                    <h6 class="fw-bold">${position}</h6>
                    <p class="mb-1">${company}</p>
                    <p class="text-muted small">${expStart ? new Date(expStart).toLocaleDateString('pt-BR') : ''} ${expEnd ? '- ' + new Date(expEnd).toLocaleDateString('pt-BR') : ''}</p>
                    ${description ? `<p>${description}</p>` : ''}
                </div>
            `;
        }
    });

    // Coletar referências
    let referencesHTML = '';
    const referenceGroups = document.querySelectorAll('.reference-group');
    referenceGroups.forEach(group => {
        const refNameInput = group.querySelector('input[name="ref_name[]"]');
        const refPositionInput = group.querySelector('input[name="ref_position[]"]');
        const refCompanyInput = group.querySelector('input[name="ref_company[]"]');
        const refPhoneInput = group.querySelector('input[name="ref_phone[]"]');
        const refEmailInput = group.querySelector('input[name="ref_email[]"]');
        
        const refName = refNameInput ? refNameInput.value || '' : '';
        const refPosition = refPositionInput ? refPositionInput.value || '' : '';
        const refCompany = refCompanyInput ? refCompanyInput.value || '' : '';
        const refPhone = refPhoneInput ? refPhoneInput.value || '' : '';
        const refEmail = refEmailInput ? refEmailInput.value || '' : '';
        
        if (refName) {
            referencesHTML += `
                <div class="mb-3">
                    <h6 class="fw-bold">${refName}</h6>
                    <p class="mb-1">${refPosition} ${refCompany ? '- ' + refCompany : ''}</p>
                    ${refPhone ? `<p class="small mb-0"><i class="bi bi-telephone"></i> ${refPhone}</p>` : ''}
                    ${refEmail ? `<p class="small mb-0"><i class="bi bi-envelope"></i> ${refEmail}</p>` : ''}
                </div>
            `;
        }
    });

    // Gerar HTML do preview
    const previewHTML = `
        <div class="cv-content">
            <div class="text-center mb-4">
                <h2 class="fw-bold">${fullName}</h2>
                <p class="text-muted">
                    ${age ? age + ' anos' : ''} ${email ? '| ' + email : ''} ${phone ? '| ' + phone : ''}
                </p>
                ${address ? `<p class="text-muted">${address}</p>` : ''}
            </div>

            ${objective ? `
                <div class="mb-4">
                    <h5 class="border-bottom pb-2"><i class="bi bi-bullseye"></i> Objetivo Profissional</h5>
                    <p>${objective}</p>
                </div>
            ` : ''}

            ${educationHTML ? `
                <div class="mb-4">
                    <h5 class="border-bottom pb-2"><i class="bi bi-mortarboard"></i> Formação Acadêmica</h5>
                    ${educationHTML}
                </div>
            ` : ''}

            ${experiencesHTML ? `
                <div class="mb-4">
                    <h5 class="border-bottom pb-2"><i class="bi bi-briefcase"></i> Experiência Profissional</h5>
                    ${experiencesHTML}
                </div>
            ` : ''}


            ${referencesHTML ? `
                <div class="mb-4">
                    <h5 class="border-bottom pb-2"><i class="bi bi-people"></i> Referências</h5>
                    ${referencesHTML}
                </div>
            ` : ''}
        </div>
    `;

    console.log('Preview HTML gerado, tamanho:', previewHTML.length);
    previewDiv.innerHTML = previewHTML;
    console.log('Preview atualizado com sucesso');
}

