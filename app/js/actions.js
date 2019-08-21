(function(){
    var {dialog} = require('electron').remote;
    var mammoth = require('mammoth');
    const { ipcRenderer } = require('electron');
    var fs = require('fs');

    var loader = document.getElementById('loader');
    var inpEle = document.querySelector('input[name="task-name"]');
    var addbtn = document.querySelector(".addBtn");
    if(inpEle && addbtn ){
        addbtn.addEventListener('click', function(e){
            if(inpEle.value && inpEle.value.length > 0){
                var ulEle = document.querySelector(".actionList");
                var eleToAdd =  document.createElement('li');
                eleToAdd.innerHTML = inpEle.value+'<button onclick="removeTask('+inpEle.value+')">Remove</button>';
                ulEle.appendChild(eleToAdd);
            }
        });

    }
    var selectFileToConvert = document.querySelector('#selectFileToConvert');
    if(selectFileToConvert){
        selectFileToConvert.addEventListener('change', function(e){
            console.log("Event >> ", e);
        });
    }
    var selectFileName = document.querySelector('#selectFileName');
    if(selectFileName){
        selectFileName.addEventListener('click', () => {
            dialog.showOpenDialog((fileName) => {
                if(fileName == undefined){
                    return;
                }
                // converting the file to html
                if(!mammoth){
                    console.error("Unable to complete request");
                    return;
                }
                toggleLoaderElement();
                mammoth.convertToHtml({path: fileName[0]})
                    .then(function(result){
                        var html = result.value;
                        var messages = result.messages;
                        saveFileWithContent(html);
                    })
            });
        }, false);
    }
    function saveFileWithContent(content){
        dialog.showSaveDialog((fileName) => {
            if(fileName === undefined){
                toggleLoaderElement();
                console.error("User cancelled save functionality");
                return;
            }
            // generating the template
            content = generateTemplate(content);
            if(fs){
                fs.writeFile(fileName, content, (err) => {
                    toggleLoaderElement();
                    if(err){
                        console.log("Error occurred  while writing the file >>", err.message);
                        return;
                    }
                    alert('Output file generated successfully!');
                });
            }
        });
    }
    function generateTemplate(content){
        var templateScript = document.getElementById('template-script');
        var templateJS = document.getElementById('template-JS-script');
        var templateTitle = document.getElementById('docTitle');
        var templateJStxt = templateJS ? templateJS.innerHTML : '';
        var template = templateScript ? templateScript.innerHTML : '';
        if(!template){
            console.error("Error reading template file");
        }
        // adding template script
        template =  template.indexOf('<head>') != -1 ? template.substring(0, (template.indexOf('<head>') + 6)).trim() + '<script type="text/javascript">' + templateJStxt + '</script>' + template.substring((template.indexOf('<head>') + 6), (template.length-1)).trim() : template;
        // adding the custom title
        template =  (template.indexOf('<title>') != -1) && templateTitle && templateTitle.value.length ? template.substring(0, (template.indexOf('<title>') + 7)).trim() + templateTitle.value + template.substring((template.indexOf('<title>') + 7), (template.length-1)).trim() : template;
        template = (template.indexOf('id="titleBlock">') != -1) && templateTitle && templateTitle.value.length ? template.substring(0, (template.indexOf('id="titleBlock">') + 16)).trim() + templateTitle.value + template.substring(template.indexOf('id="titleBlock">') + 16,  (template.length-1)).trim() : template;
        // adding the content to the body
        var bodyLocation = template.indexOf('<section content>');
        if(bodyLocation != -1){
            var newContent = template.substring(0, (bodyLocation+17)).trim() + content.trim() + template.substring((bodyLocation+17), (template.length-1)).trim();
            content = newContent;
        }
        return content;
    }
    function toggleLoaderElement(){
        if(loader){
            loader.style.visibility == 'visible' ? loader.style.visibility = 'hidden': loader.style.visibility = 'visible';
        }
    }
})();