$(function(){

  $(".dropdown-menu").on('click', 'li a', function(){
    $(".btn:first-child").text($(this).text()+" ");
    $(".btn:first-child").append("<span class='caret'></span>");
    $('#correct').val($(this).attr("data-value"));
  });


});

function addQuestion(){

  window.location.href = '/questions/add';
}

function cancelAdd(){

  window.location.href = '/questions';
}

function addAnswerForm(){
  var count = $("#ans input").length;
  // append input control at end of form
  $("<label>"+String.fromCharCode(97 + count)+")</label>")
  .appendTo("#ans");
  $("<input type='text' required />")
  .attr("name", "answers["+count+"][body]")
  .attr("placeholder", "Answer")
  .appendTo("#ans");
  $("<br />")
  .appendTo("#ans");
  $("<li><a href='#' data-value='"+count+"'>"+String.fromCharCode(97 + count)+")</a></li>")
  .appendTo(".dropdown-menu")
}

function removeAnswerForm(){
  count = $("#ans input").length
  if(count > 1){
    $("#ans br").last().remove();
    $("#ans input").last().remove();
    $("#ans label").last().remove();
    $('.dropdown-menu').children().last().remove();
    if( $('#correct').val() == count - 1){
      $('.dropdown-toggle').text("a) ");
      $('.dropdown-toggle').append("<span class='caret'></span>");
      $('#correct').val(0);
    }
  }
}
