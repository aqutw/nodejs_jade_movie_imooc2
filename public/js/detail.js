$(function(){
    $('.comment').click(function(){
        var $e=$(this);
        var toId = $e.data('tid');
        var commentId = $e.data('cid');
        var $toId = $('#toId'),
            $commentId = $('#commentId');
        
        if( $toId.length ) {
            $toId.val(toId);
        } else { 
        $('<input>').attr({
            type: 'hidden',
            id: 'toId',
            name: 'comment[tid]',
            value: toId
        }).appendTo('#commentForm');
        }
        
        if ( $commentId.length ) {
            $commentId.val(commentId);
        } else {
        $('<input>').attr({
            type: 'hidden',
            id: 'commentId',
            name: 'comment[cid]',
            value: commentId
        }).appendTo('#commentForm');
        }
    });
});