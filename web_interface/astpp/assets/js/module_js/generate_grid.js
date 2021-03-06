$(document).ready(function() {
    $("#show_search").click(function(){
        $("#search_bar").slideToggle("slow");
    });  
    $("#updatebar").click(function(){
        $("#update_bar").slideToggle("slow");
    });
    $('.checkall').click(function () { 
        $('.chkRefNos').attr('checked', this.checked); //if you want to select/deselect checkboxes use this
    });
    jQuery("#customer_cdr_from_date").datetimepicker({format:'Y-m-d H:i:s'});		
    jQuery("#customer_cdr_to_date").datetimepicker({format:'Y-m-d H:i:s'});
    $('.toast-close-button').click(function(){
        $("#toast-container").css("display","none");
	$("#toast-container_error").css("display","none");
    });
});
function get_alert_msg(id)
{
    confirm_string = 'are you sure to delete?';
    var answer = confirm(confirm_string);
    return answer // answer is a boolean
}

function get_alert_msg_restore(id)
{
    confirm_string = 'Are you sure want to restore this database?';
    var answer = confirm(confirm_string);
    return answer // answer is a boolean
}

function clickchkbox(chkid){

    var chk_flg = 0;
    $(".chkRefNos").each( function () {
        if(this.checked == false) {
            $('.checkall').attr('checked', false);
            chk_flg++;
        } 
    });
    if(chk_flg == 0){
        $('.checkall').attr('checked', true);
    }
}
function post_request_for_search(grid_id,destination,form_id){
    if(destination == ""){
        destination = build_url("_search");
    }
    $.ajax({
        type:'POST',
        url: destination,
        data:$('#'+form_id).serialize(), 
        success: function(response) { 
            $('#'+grid_id).flexOptions({newp:1}).flexReload();
            document.getElementById("active_search").innerHTML = "(Active...)";   
        }
    });
}
function clear_search_request(grid_id,destination){ 
    if(destination == ""){
        destination = build_url("_clearsearchfilter");
    }
    $.ajax({
        type:'POST',
        url: destination,
        success: function(response) {
            $('#'+grid_id).flexOptions({newp:1}).flexReload();
            document.getElementById("active_search").innerHTML = "";
        }
    });
}
function build_url(append_value){
    var url_string ="";
    url_string = document.URL.substring(0,document.URL.length-1)+append_value;
    return url_string;
}
function build_grid_reports(grid_id,destination,collumn_arr,buttons){
    if(destination == ""){
        destination = build_url("_json");
    }
  $("#"+grid_id).flexigrid({
	  url: destination,
	  method: 'GET',
	  dataType: 'json',
	  colModel :build_collumns(collumn_arr),
 	  buttons :build_buttons(buttons),
	  sortname: "",
	  sortorder: "",
	  usepager: false,
	  resizable: true,
	  title: '',
	  pagetext: 'Page',
	  outof: 'of',
	  nomsg: 'No Records',
	  procmsg: 'Processing, please wait ...',
	  pagestat: 'Displaying {from} to {to} of {total} Records',
	  onSuccess: function(data){ 
	      $('a[rel*=facebox]').facebox({
		  loadingImage : '/assets/images/loading.gif',
		  closeImage   : '/assets/images/closelabel.png'
	      });
	  },
/*	  onError: function(){ 
	      alert("Request failed");
	  }*/
      });
      $("#"+grid_id).addClass("flex_grid_reports");
}
function build_grid(grid_id,destination,collumn_arr,buttons){
    if(destination == ""){
        destination = build_url("_json");
    }
    $("#"+grid_id).flexigrid({
        url: destination,
        method: 'GET',
        dataType: 'json',
        colModel :build_collumns(collumn_arr),
        buttons :build_buttons(buttons),
        usepager: true,
        resizable: true,
        title: '',
        pagetext: 'Page',
        outof: 'of',
        nomsg: 'No Records',
        procmsg: 'Processing, please wait ...',
        pagestat: '{from} - {to} of {total} Records',
        onSuccess: function(data){ 
            $('a[rel*=facebox]').facebox({
                loadingImage : '/assets/images/loading.gif',
                closeImage   : '/assets/images/closelabel.png'
            });
        },
/*        onError: function(data){ 
var col_field = [];
for (var key in data) {
col_field.push(data[key]);
}
        alert(col_field);
            alert("Request failed");
        }*/
    });
    $("#"+grid_id).addClass("flex_grid");
}
  
function build_collumns(collumn_arr){
    var col_field = [];
    var collumn_property = new Array();
    var col_arr ="";
    col_arr = collumn_arr;
    for (var key in col_arr) {
        col_field.push(col_arr[key]);
    }
    var jsonObj = []; //declare object
    for (var i = 0; i < col_field.length; i++) {
        if(col_field[i] !=""){
            var col_str =col_field[i];
	    if(col_str != 'null' && col_str != ''){
            collumn_property = col_str.toString().split(',');
	    
            // 	    alert("{display:"+collumn_property[0]+", name:"+collumn_property[0]+", width:"+collumn_property[1]+" , sortable: 'false', align: 'center'}");
            jsonObj.push({
                display:collumn_property[0], 
                name: collumn_property[0], 
                width: collumn_property[1],  
                align: 'center'
            });
	    }
        }
    }
    return jsonObj;
}
  
function build_buttons(buttons_arr){
    var jsonObj = []; //declare object
    if(buttons_arr == ""){
        return jsonObj;
    }
    var btn_field = [];
    var button_property = new Array();

    var btn_arr = buttons_arr;
    for (var key in btn_arr) {
      if(btn_arr[key] != null)
        btn_field.push(btn_arr[key]);
    }

    for (var i = 0; i < btn_field.length; i++) {
        if(btn_field[i] !=""){
            var btn_str =btn_field[i];
            button_property = btn_str.toString().split(',');
            //ASTPP   
      
            if(button_property[5] == 'popup'){ 
                jsonObj.push({
                    name: button_property[0], 
                    bclass: button_property[1],
                    iclass: button_property[2],
                    btn_url:button_property[4], 
                    onpress: button_action_popup
                });
            }else{
                jsonObj.push({
                    name: button_property[0], 
                    bclass: button_property[1],
                    iclass: button_property[2],
                    btn_url:button_property[4], 
                    onpress: button_action
                });
            }
        }
    }
    return jsonObj;
}

function redirect_page(url)
{
    if(url == "NULL"){
        $(document).trigger('close.facebox');
    }else{
        window.location.href = url;
    }
}
function delete_multiple(btn_url){
    var result = "";                        
    $(".chkRefNos").each( function () {
        if(this.checked == true) {     
            result += ",'"+$(this).val()+"'";
        } 
    });     
    result = result.substr(1);
    // 	alert(result);
    if(result){
        confirm_string = 'Are you sure want to Delete this selected records?';
        var answer = confirm(confirm_string);
        if(answer){
            $.ajax({ 
                type: "POST",
                cache    : false,
                async    : true,  
                url: btn_url,
                data: "selected_ids="+result,
                success: function(data){ 
                    if(data == 1)
                    {
                        $('.flex_grid').flexOptions({newp:1}).flexReload(); 
                    } else{
                        alert("Proble to delete records");
                    }
                }
            });
        }
    } else{
        alert("Please select atleast one record to delete.");
    }
}
function button_action(t, grid){
    if(t.name == 'Refresh'){
        $('.flex_grid').flexReload();
    }
    else if(t.name=="DELETE" || t.name=="Delete"){
        delete_multiple(t.btn_url);
    }else{
        window.location = t.btn_url;
    }
     
}
function button_action_popup(t, grid){ 
    if(t.name == 'Refresh'){
        $('.flex_grid').flexReload();
    }
    else if(t.name=="DELETE"){
        delete_multiple(t.btn_url);
    }else{ 
        jQuery.facebox({
            ajax: t.btn_url
        });
    }
}
  
function submit_form(form_id){
    $('#error_msg').fadeIn();
    var form = $('#'+form_id);
    $.ajax({
        type:'POST',
        url: form.attr('action'),
        data:$('#'+form_id).serialize(), 
        success: function(response) {
//  	    alert(response); 
            var tmp = jQuery.parseJSON(response);
            if(!tmp.SUCCESS){
               $(".error_div").css("display","block");
                var myObject = eval('(' + response + ')');
                for (i in myObject){
                    $("#"+i).html(myObject[i]);
                }
            }else{
		$("#toast-container").css("display","block");
                $(".toast-message").html(tmp.SUCCESS);
                $('.toast-top-right').delay(5000).fadeOut();
                $(document).trigger('close.facebox');
                $('.flex_grid').flexReload();
            }
            return false;
        }
    });
} 
function display_astpp_message(validate_ERR,ERR_type){ 
	if(ERR_type == "notification")
	{
	    $("#toast-container_error").css("display","block");
	    $(".toast-message").html(validate_ERR);
	    $('.toast-top-right').delay(5000).fadeOut();
	  
	}else{
	  $("#toast-container").css("display","block");
	  $(".toast-message").html(validate_ERR);
	  $('.toast-top-right').delay(5000).fadeOut();
	}
}
function print_error(ERR_STR){
        $(".error_div").css("display","block");
        var myObject = eval('(' + ERR_STR + ')');
        for (i in myObject){
//            alert(i+"==============="+myObject[i]);
            $("#"+i).html(myObject[i]);
        }
}
