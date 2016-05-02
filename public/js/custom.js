$(function(){

    $('#search').keyup(function(){
        var search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/api/search',
            data:{
                search_term
                //not sure why this has to be in curly braces
            },
            dataType: 'json',
            success: function(json) {
                //on success, take elasticsearch object and apply map so we can loop through results

                var data = json.hits.hits.map(function(hit){
                    return hit;
                });
                $('#searchResults').empty();
                //clear search results
                for(var i = 0; i <data.length; i++){
                    //loop through results
                    var html="";
                    html+= '<div class="col-md-4">';
                    html+= '<a href="/product/' + data[i]._source._id + '">';
                    html+= '<div class="thumbnail">';
                    html+= '<img src="' + data[i]._source.image + '">';
                    html+= '<div class="caption">';
                    html+= '<h3>' + data[i]._source.name + '</h3>';
                    html+= '<p>' + data[i]._source.category.name + '</p>';
                    html+= '<p>' + data[i]._source.price + '</p>';
                    html+= '</div></div></a></div>';

                    $('#searchResults').append(html);
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    })






});