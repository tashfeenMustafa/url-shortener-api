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
                var resultHTML = '<div class="link-container"><h4><a class="result" href="https://' + data.long_url + '" target="_blank">'
                    + data.long_url + '</a></h4><a class="result" href="https://' + data.long_url + '" target="_blank">'
                    + data.short_url + '</a><i class="material-icons copy-content">&#xE14D;</i></div>';
                $('#link').html(resultHTML);
                $('#link').hide().fadeIn('slow');
            }
        }); // End of Ajax call    
    }); // End of .btn-shorten
}); // End of ready