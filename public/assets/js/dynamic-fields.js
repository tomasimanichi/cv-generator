$(document).ready(function() {
    let experienceCount = 1;
    let referenceCount = 0;
    
    // Adicionar experiência
    $('#adicionar-experiencia').click(function() {
        experienceCount++;
        const html = `
            <div class="experiencia-item border p-3 mb-3 rounded" id="exp-${experienceCount}">
                <button type="button" class="btn btn-danger btn-sm float-end remover-exp">
                    <i class="bi bi-trash"></i> Remover
                </button>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label class="form-label">Empresa</label>
                        <input type="text" class="form-control" name="company[]">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-control" name="position[]">
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label class="form-label">Data Início</label>
                        <input type="date" class="form-control" name="exp_start[]">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Data Término</label>
                        <input type="date" class="form-control" name="exp_end[]">
                    </div>
                </div>
                <div class="mb-2">
                    <label class="form-label">Descrição</label>
                    <textarea class="form-control" name="exp_description[]" rows="2"></textarea>
                </div>
            </div>
        `;
        $('#experiencias-container').append(html);
    });
    
    // Adicionar referência
    $('#adicionar-referencia').click(function() {
        referenceCount++;
        const html = `
            <div class="reference-item border p-3 mb-3 rounded" id="ref-${referenceCount}">
                <button type="button" class="btn btn-danger btn-sm float-end remover-ref">
                    <i class="bi bi-trash"></i> Remover
                </button>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-control" name="ref_name[]">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-control" name="ref_position[]">
                    </div>
                </div>
                <div class="row mb-2">
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
        `;
        $('#referencias-container').append(html);
    });
    
    // Remover campos
    $(document).on('click', '.remover-exp, .remover-ref', function() {
        $(this).closest('.experiencia-item, .reference-item').fadeOut(300, function() {
            $(this).remove();
        });
    });
});
