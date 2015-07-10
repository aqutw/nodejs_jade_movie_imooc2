$(function(){
  $('.del').click(function(e){
    var $e=$(e.target);
    var id = $e.data('id');
    var $tr = $('.item-id-'+id);

    $.ajax({type: 'DELETE', url: '/admin/movie/list?id='+id})
      .done(function(res){
        if (res.success === 1){
	  if ($tr.length > 0){
	    $tr.remove();
	  }
	}
      });
  });
});
