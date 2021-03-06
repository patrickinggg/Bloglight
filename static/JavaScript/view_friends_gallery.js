window.onload = function(){
  var blogUrl = window.location.origin;
  var webUrl = blogUrl.substring(0, blogUrl.length-1) + "0";
  const parsedUrl = (window.location.pathname).split('/');
  const picArtId = parsedUrl[parsedUrl.length-1];
  var id = sessionStorage.getItem("view_id");
  var homeId =sessionStorage.getItem("homeId");

  var rowId = "";
  var imgtype = "";
  var imgId = "";

  var DisplayBlog = new Vue({
    el: '#imgBlogContainer',
    data: {
        dateAdded: "",
        title: "",
        content:"",
        image:""
    },
    mounted: function () {
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", blogUrl + "/blog/getpic/?id="+picArtId);

        xhttp.addEventListener( "load", function(event) {
            var myObj = JSON.parse(this.responseText);
            var timeadded = myObj.createTime;
            var timemodified = myObj.modifyTime;
            rowId = myObj.rowId;
            if (timeadded == timemodified){
              var time = timeadded.split(" ");
              self.dateAdded = "Date Added: "+makedouble(time[0])+"/" + makedouble(time[1])+"/"+ makedouble(time[2])+" "+ makedouble(time[3])+":"+ makedouble(time[4]);
            } else{
              var time = timemodified.split(" ");
              self.dateAdded = "Date Modified: "+makedouble(time[0])+"/" + makedouble(time[1])+"/"+ makedouble(time[2])+" "+ makedouble(time[3])+":"+ makedouble(time[4]);
            }

            self.content = myObj.content;
            self.title = myObj.title ;

        } );

        xhttp.send();

        var picxhttp = new XMLHttpRequest();

        picxhttp.open("POST", blogUrl +"/img_collection");

        picxhttp.addEventListener( "load", function(event) {

          var myObj = JSON.parse(event.target.responseText);
          imgId = myObj.collection[0].imgid

          var artimghttp = new XMLHttpRequest();
          artimghttp.open("POST", blogUrl +"/img_get");
          artimghttp.addEventListener( "load", function(event) {
            var imageObj = JSON.parse(event.target.responseText);
            imgtype = imageObj.image.imgtype;
            if (imageObj.image.imgtype == 3){
              console.log(imageObj);
              var imagebase64 = imageObj.image.img;
              var imagebase64 = imagebase64.replace(/\-/g, "+");
              var imagebase64 = imagebase64.replace(/\_/g, "/");

              self.image= imagebase64;
              // console.log(self.image);
            } else {
              console.log(imageObj);
              var base64 = arrayBufferToBase64(imageObj.image.img.data);
              var imagesrc = "data:image/"+ imgType(imageObj.image.imgtype)+";base64,"+base64;
              self.image= imagesrc;
            }
          });
          artimghttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
          artimghttp.send("imgId=" +myObj.collection[0].imgid);

        } );
        picxhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

        picxhttp.send("domain=art&artId=" +picArtId);
    },
    methods: {
      returnToGalleryButtonhandler: function(){
        {
          window.location.replace(blogUrl+"/blog/friends_gallery_page/id="+id+"&homeId="+homeId);
        }
      },
    }

  });



  function imgType(type){
    if (type == 0){
      return "jpg";
    } else if (type == 1){
      return "png";
    } else {
      return "gif"
    }
  }

  function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  function makedouble(digit){
    if (digit.length == 1){
      digit = "0" + digit;
    }
    return digit;
  }
  var logoutButton = document.getElementById("logout");
  logoutButton.addEventListener('click', function(){
    $.removeCookie('sid', { path: '/' });
    sessionStorage.removeItem('id');
    window.location.replace(webUrl+"/home");
  });

};
