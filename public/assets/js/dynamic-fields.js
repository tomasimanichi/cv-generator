$(document).ready(function() {
    let experienceCount = 1;
    let referenceCount = 1;
    let educationCount = 1;
    
    // Adicionar formação acadêmica
    $('#addEducationBtn').click(function() {
        educationCount++;
        const html = `
            <div class="education-group card mb-3">
                <div class="card-body">
                    <button type="button" class="btn btn-danger btn-sm float-end remove-education">
                        <i class="bi bi-trash"></i>
                    </button>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Curso</label>
                            <input type="text" class="form-control" name="course[]">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Instituição</label>
                            <input type="text" class="form-control" name="institution[]">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Nível</label>
                            <select class="form-control" name="education_level[]">
                                <option value="">Selecione...</option>
                                <option value="fundamental">Ensino Fundamental</option>
                                <option value="medio">Ensino Médio</option>
                                <option value="tecnico">Curso Técnico</option>
                                <option value="superior">Ensino Superior</option>
                                <option value="pos">Pós-Graduação</option>
                                <option value="mestrado">Mestrado</option>
                                <option value="doutorado">Doutorado</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Ano de Conclusão</label>
                            <input type="number" class="form-control" name="graduation_year[]" min="1950" max="2030">
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#educationList').append(html);
    });
    
    // Adicionar experiência
    $('#adicionar-experiencia').click(function() {
        experienceCount++;
        const html = `
            <div class="experience-group card mb-3">
                <div class="card-body">
                    <button type="button" class="btn btn-danger btn-sm float-end remove-experience">
                        <i class="bi bi-trash"></i>
                    </button>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Empresa</label>
                            <input type="text" class="form-control" name="company[]">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Cargo</label>
                            <input type="text" class="form-control" name="position[]">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Data Início</label>
                            <input type="date" class="form-control" name="exp_start[]">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Data Término</label>
                            <input type="date" class="form-control" name="exp_end[]">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" name="exp_description[]" rows="2"></textarea>
                    </div>
                </div>
            </div>
        `;
        $('#experiencesList').append(html);
    });
    
    // Adicionar referência
    $('#adicionar-referencia').click(function() {
        referenceCount++;
        const html = `
            <div class="reference-group card mb-3">
                <div class="card-body">
                    <button type="button" class="btn btn-danger btn-sm float-end remove-reference">
                        <i class="bi bi-trash"></i>
                    </button>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Nome</label>
                            <input type="text" class="form-control" name="ref_name[]">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Cargo</label>
                            <input type="text" class="form-control" name="ref_position[]">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <label class="form-label">Empresa</label>
                            <input type="text" class="form-control" name="ref_company[]">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Telefone</label>
                            <input type="tel" class="form-control" name="ref_phone[]">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" name="ref_email[]">
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#referencesList').append(html);
    });
    
    // Remover campos
    $(document).on('click', '.remove-education', function() {
        $(this).closest('.education-group').fadeOut(300, function() {
            $(this).remove();
        });
    });
    
    $(document).on('click', '.remove-experience', function() {
        $(this).closest('.experience-group').fadeOut(300, function() {
            $(this).remove();
        });
    });
    
    $(document).on('click', '.remove-reference', function() {
        $(this).closest('.reference-group').fadeOut(300, function() {
            $(this).remove();
        });
    });
});
