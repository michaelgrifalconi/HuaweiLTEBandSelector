
function currentBand()
{
    $.ajax({
        type:"GET",
        async : true,
        url: '/api/device/signal',
        error:function(request,status,error){
            alert("Signal Error:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
           },            
        success:function(data){
            var report = "";
            report = report + "RSRQ/RSRP/SINR :"+extractXML("rsrq",data)+"/"+extractXML("rsrp",data)+"/"+extractXML("sinr",data);           
            report = report + "\nBand : "+extractXML("band",data)+" - "+extractXML("dlbandwidth",data);
            report = report + "\nEARFCN : "+extractXML("earfcn",data);           
            alert(report);
        }});
}
function extractXML(tag, data)
{
    try {
        return data.split("</"+tag+">")[0].split("<"+tag+">")[1];
    }
    catch(err)
    {
        return err.message;
    }
    
}

function ltebandselection()
{
    if(arguments.length==0)
    {
        var band = prompt("사용하고자 하는 LTE Band를 입력하세요. 여러 개의 Band를 사용할 경우 띄어쓰기 없이 +로 이어서 입력하세요. (Ex. SKT 1+3+5+7 / KT 3+8 / LG 1+5+7)","1+3+5+7");
        if(band==null||band==="")
        {
            return;
        }
    }
    else var band = arguments[0];
   
    if(!window.location.href.includes("/html/home.html"))
    {
        alert("메인 화면에서만 사용 가능합니다.");
        return;
    }
    else
    {  
        var bs = band.split("+"); 
        var ltesum = 0;
        if(band.toUpperCase()==="ALL")
        {
            ltesum = "7FFFFFFFFFFFFFFF";
        }
        else
        {
            
            for (var i=0;i<bs.length;i++)
            {
                ltesum = ltesum + Math.pow(2,parseInt(bs[i])-1);
            }
            ltesum = ltesum.toString(16);
            console.log("LTEBand:"+ltesum);
        }
        
        
        $.ajax({
            type:"GET",
            async : true,
            url: '/html/home.html',
            error:function(request,status,error){
                alert("Token Error:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
               },            
            success:function(data){
                
                var datas = data.split('name="csrf_token" content="');
                var token = datas[datas.length-1].split('"')[0];
                setTimeout(function(){
                    $.ajax({
                        type: "POST",
                        async : true,
                        url: '/api/net/net-mode',
                        headers:{'__RequestVerificationToken':token},
                        contentType: 'application/xml',
                        data: '<request><NetworkMode>03</NetworkMode><NetworkBand>3FFFFFFF</NetworkBand><LTEBand>'+ltesum+'</LTEBand></request>',
                        success:function(nd){
                            
                            alert(nd);
                            
                        },
                        error:function(request,status,error){
                            alert("Net Mode Error:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                           }
                        });


                },2000);
                
            }});
    }
}