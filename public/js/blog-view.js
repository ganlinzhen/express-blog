console.log('点赞js加载完成')
$('#favouriteAdd').click(function(){
  let pathname = window.location.pathname
  var id = pathname.split('/')[3]
  $.ajax({
    url: '/api/favourite',
    type: 'get',
    data: {
      id: id
    },
    success: function(res) {
      if (res.code === 200) {
        alert(res.msg)
        $('#favouriteCount').html(res.data.meta.favourite)
      }
    }
  })
})
