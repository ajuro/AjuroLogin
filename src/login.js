﻿function GenerateSubmit(text, options)
{
	var row = $('<tr></tr>');
	var def = $('<td></td>').attr('colspan', 2).css('text-align', 'right');
	var submitButton = $('<input></input>').attr('type', 'submit').attr('value', text);
	var submitHolder = $('<span style="width: 100%; text-align:right"><span>').on('click', SubmitLoginForm);
	submitHolder.append(submitButton).append($('<span id="login_error_placeholder"></span>').css('text-align', 'left').css('color', 'red'));
	for(i=0; i<options.length; i++)
	{
		def.append($('<a style="font-size:small; margin:3px; text-align:left">['+options[i].text+'] </a>').css('color', '#008').css('cursor', 'hand').css('text-decoration', 'none').css('border', '0px solid silver').css('padding', '1px 1px 1px 1px').on('click', options[i].onclick));
	}
	def.append(submitHolder);
	def.append($('<hr>'));
	row.append(def);
	return row;
}

function ActionCompleted(a, b, c)
{
	var a = null;
}

function ActionAborted(a, b, c)
{
	var a = null;
}

function SubmitLoginForm()
{
	var json_data = {};
	$.map( $("#login_placeholder :input"), function(n, i) 
	{
		if(n.name)
		{
			var value = $(n).val();
			if(n.name == 'password' && n.name == 'password2')
			{
				value = (value); // Use MD5
			}
			json_data[n.name] = value;
		} 
	} );
	
	$.ajax(
	{
		type: "POST",
		url: "./api/index.php",
		data: JSON.stringify(json_data),
		contentType: "application/json; charset=utf-8",
        dataType: 'json'
	})
	.done(function(result, error, sender) 
	{
		if(result.status.success)
		{
			RenderViewLogout(result.result[0].username);
			$("#login_error_placeholder").html(result.status.message);
		}
		else
		{
			$("#login_error_placeholder").html(result.status.message);
		}
	})
	.fail(function(sender, error, message)
	{
		//alert( "error" );
	})
	.always(function(sender, error, message) 
	{
		//alert( "complete" );
	});;
	return json_data;
}

function GenerateOptions(text, options)
{
	var row = $('<tr></tr>');
	var def = $('<td></td>').attr('colspan', 2).css('text-align', 'right');
	var submitButton = $('<input></input>').attr('type', 'submit').attr('value', text);//.css({'background-color', 'green'});
	var submitHolder = $('<div style="width: 100%; text-align:right"><div>');
	submitHolder.append(submitButton).append($('<div id="login_error_placeholder"></div>'));
	//def.append($('<div>'+text+'</div>').css('color', 'gray'));
	row.append(def);
	def.append($('<hr>'));
	return row;
}

function GenerateInputHiddenElement(fieldName, value)
{
	var input = $('<input></input>').attr('type', 'hidden').attr('name', fieldName).attr('value', value);
	return input;
}

function GenerateInputTextElement(label, fieldName)
{
	var row = $('<tr></tr>');
	var label = $('<td>'+label+'</td>');
	var input = $('<td></td>').append($('<input style="width: 100%"></input>').attr('type', 'text').attr('name', fieldName));
	row.append(label);
	row.append(input);
	return row;
}

function GenerateInputPasswordElement(label, fieldName)
{
	var row = $('<tr></tr>');
	var label = $('<td>'+label+'</td>');
	var input = $('<td></td>').append($('<input style="width: 100%"></input>').attr('type', 'password').attr('name', fieldName));
	row.append(label);
	row.append(input);
	return row;
}

var RenderViewLogin = function ()
{
	var form = $('<table style="width: 300px; float:right"></table>');
	form.append(GenerateOptions('Login!', [{"text":'Am uitat parola!', "onclick":RenderViewRecover }, {"text":'Înregistrare', "onclick":RenderViewRegister}]));
	form.append(GenerateInputTextElement('Email', 'email'));
	form.append(GenerateInputPasswordElement('Parola', 'password'));
	form.append(GenerateSubmit('Login!', [{"text":'Am uitat parola!', "onclick":RenderViewRecover }, {"text":'Înregistrare', "onclick":RenderViewRegister}]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_login'))
		.css('width', '100%')
		.append(form);
	return form; 
}

function RenderViewLogout()
{
	var form = $('<table  style="width: 300px; float:right"></table>');
	form.append(GenerateOptions('Logout', [{"text":'Logout', "onclick":RenderViewLogin }]));
	form.append(GenerateSubmit('Logout', [{"text":'Logout', "onclick":RenderViewLogin }]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_logout'))
		.append(form);
	return form; 
}
var RenderViewRegister = function ()
{
	var form = $('<table  style="width: 300px; float:right"></table>');
	form.append(GenerateOptions('Înregistrare!', [{"text":'Login', "onclick":RenderViewLogin}]));
	form.append(GenerateInputTextElement('Email', 'email'));
	form.append(GenerateInputPasswordElement('Parola', 'password'));
	form.append(GenerateInputPasswordElement('Parola', 'password2'));
	form.append(GenerateSubmit('Înregistrare!', [{"text":'Login', "onclick":RenderViewLogin}]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_register'))
		.append(form);
	return form; 
}
var RenderViewRecover = function ()
{
	var form = $('<table  style="width: 300px; float:right"></table>');
	form.append(GenerateOptions('Send!', [{"text":'Login', "onclick":RenderViewLogin}, {"text":'Înregistrare', "onclick":RenderViewRegister}]));
	form.append(GenerateInputTextElement('Email', 'email'));
	form.append(GenerateSubmit('Send!', [{"text":'Login', "onclick":RenderViewLogin}, {"text":'Înregistrare', "onclick":RenderViewRegister}]));
	$("#login_placeholder")
		.empty()
		.append(GenerateInputHiddenElement('user_action', 'user_action_recover_password'))
		.append(form);
	return form; 
}

function GenerateLoginComponents()
{
	RenderViewLogin();
}

$(function() 
{
	GenerateLoginComponents();
});
