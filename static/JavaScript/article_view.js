window.onload = function(){
  var blogUrl = window.location.origin;
  var webUrl = blogUrl.substring(0, blogUrl.length-1) + "0";
  const parsedUrl = (window.location.pathname).split('/');
  const artid = parsedUrl[parsedUrl.length-1];
  var id = sessionStorage.getItem("id");
  var editButton = document.getElementById('edit');
  var deleteButton = document.getElementById('delete');
  var returnToMainButton = document.getElementById('returnToMain');
  var returnToPageButton = document.getElementById('returnToPage');
  var actualDelete = document.getElementById('modeldelete');
  var modal = document.getElementById("myModal");
  var rowId = ""
  console.log("artid is " + artid);



  var DisplayBlog = new Vue({
    el: '#blogContainer',
    data: {
        date: "",
        title: "",
        content:""
    },
    mounted: function () {
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", blogUrl + "/blog/getart/?id="+artid);

        xhttp.addEventListener( "load", function(event) {
            var myObj = JSON.parse(this.responseText);
            var timeadded = myObj.createTime;
            var timemodified = myObj.modifyTime;
            rowId = myObj.rowId;
            if (timeadded == timemodified){
              var time = timeadded.split(" ");
              self.date = "Date Added: "+makedouble(time[0])+"/" + makedouble(time[1])+"/"+ makedouble(time[2])+" "+ makedouble(time[3])+":"+ makedouble(time[4]);
            } else{
              var time = timemodified.split(" ");
              self.date = "Date Modified: "+makedouble(time[0])+"/" + makedouble(time[1])+"/"+ makedouble(time[2])+" "+ makedouble(time[3])+":"+ makedouble(time[4]);
            }

            self.content = myObj.content;
            self.title = myObj.title;

        } );

        xhttp.send();

    },
    methods: {
      returnToMainButtonhandler: function(){
        {
          window.location.replace(blogUrl+"/blog/user?id="+id);
        }
      },
      edithandler: function(){
        {
          window.location.replace(blogUrl+"/blog/article_write/id="+id);
          sessionStorage.setItem("artid", artid);
        }
      },
      deletehandler: function(){
        {
          modal.style.display = "block";

        }
      }
    }

  });

  returnToPageButton.addEventListener('click', function(){
    modal.style.display = "none";
  });

  actualDelete.addEventListener('click', function(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", blogUrl + "/blog/user/"+id+"/deleteart");

    xhttp.addEventListener( "load", function(event) {
        var myObj = JSON.parse(this.responseText);
        if (myObj.result == "OK"){
          window.location.replace(blogUrl+"/blog/user?id="+id);
        } else {
          alert("deletion failed")
        }

    } );
    xhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xhttp.send("rowId="+rowId);
    modal.style.display = "none";
  });

  function makedouble(digit){
    if (digit.length == 1){
      digit = "0" + digit;
    }
    return digit;
  }
  //
  // returnToMainButton.addEventListener('click', function());
  // editButton.addEventListener('click', function(){
  //   alert("!!!1")
  //   // window.location.replace(blogUrl+"/blog/user/id="+id);
  // })
  var logoutButton = document.getElementById("logout");
  logoutButton.addEventListener('click', function(){
    $.removeCookie('sid', { path: '/' });
    sessionStorage.removeItem('id');
    window.location.replace(webUrl+"/home");
  });
};
