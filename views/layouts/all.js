$(function() {
  function addQuestion(){

    window.location.href = '/questions/add';
  }
  function cancelAdd(){

    window.location.href = '/questions';
  }
  function addAnswerForm(){
    var count = $("#ans input").length;
    // append input control at end of form
    $("<input type='text' value='' />")
    .attr("id", "answers["+count+"]")
    .attr("placeholder", "Answer")
    .appendTo("#ans");
  }
});
