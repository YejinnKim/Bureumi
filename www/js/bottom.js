function change(name){
    var color;
    var text;
    switch(name){
        case 'home': text="?"
        break;
        case 'search': text='search';
        break;
        case 'write': text='wirte';
        break;
        case 'chat': text='chat';
        break;
        default: color='white'; text='Click something!'
        break;
    }
    document.body.style.backgroundColor=color;
    document.getElementById('mainText').innerHTML=text;
  
}
