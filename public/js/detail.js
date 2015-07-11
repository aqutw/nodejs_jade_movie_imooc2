$(function(){
    $('.comment').click(function(){
        var $e=$(this);
        var toId = $e.data('tid');
        var commentId = $e.data('cid');
        
        $('<input>').attr({
            type: 'hidden',
            name: 'comment[tid]',
            value: toId
        }).appendTo('#commentForm');
        
        $('<input>').attr({
            type: 'hidden',
            name: 'comment[cid]',
            value: commentId
        }).appendTo('#commentForm');
    });
});