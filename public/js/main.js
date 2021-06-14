/**
 *   @author Daniel Leandro <a21800877>
 * 
 *   Este é o ficheiro que contém a lógica de eliminação do planeta.
 *   Utilização da biblioteca jquery para auxilio da função.
 */

$(document).ready(function(){
    $('.delete-planet').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url:  '/planets/'+id,
            success: function(response){
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});