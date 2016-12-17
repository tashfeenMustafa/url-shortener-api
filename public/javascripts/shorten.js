$(document).ready(function() {
    $('.btn-shorten').on('click', function() 
    {
        $.ajax({
            url: '/api/shorten',
            type: 'POST',
            dataType: 'JSON',
            data: {url: $('#url-field').val()},
            success: function(data)
            {
                // display the shortened URL returned by the server
                var resultHTML = '<a class="result" href="https://' + data.long_url + '" target="_blank">'
                    + data.short_url + '</a>';
                $('#link').html(resultHTML);
                $('#link').hide().fadeIn('slow');
            }
        }); // End of Ajax call    
    }); // End of .btn-shorten
}); // End of ready