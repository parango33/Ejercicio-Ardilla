// Conectarse a datoos externos y mostrar en consola
let datos;
const URL = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";
fetch(URL).then(res => res.json()).then(res => {
    console.log('%cmain.js line:59 res','color: #007acc', res)
    datos = res
    console.log('%cmain.js line:59 datos','color: #007acc', datos)

    //lista con los objetos json de los datos
    let datos_array = Array.from(JSON.parse(JSON.stringify(datos))); 

    crearTabla(datos_array)

    //lista unica de los eventos
    let eventos_lista = datos_array.map(d => d.events);    
    let eventos  = [...new Set([].concat.apply([],eventos_lista))];

    //lista de las correlaciones de los eventos
    lista_correlaciones = correlacion(eventos,datos_array)

    //Crear tabla de correlaciones
    crearTablaCorr(lista_correlaciones)


})


function crearTabla(arreglo){
    const tabla = document.getElementById("tbody")
    for (let i = 0; i < arreglo.length; i++){
        let fila = document.createElement("tr") // Crea una fila para cada dato

        //Si ese dia es positivo para ardilla, ponga la fila en rojo
        if (arreglo[i].squirrel== true){
            fila.style.backgroundColor = 'LightCoral'

        } 
        for (col = 0; col < 3; col++){ //A cada columna, separela entre el numero del dato, los eventos y si es ardilla
            let columna = document.createElement("td")
            if(col == 0) { 
                let num = document.createTextNode(i) //Si es la columna 0, ponga el numero del dato
                columna.appendChild(num)
            } 
            if (col == 1){
                //let eventos = document.createTextNode(JSON.parse(JSON.stringify(arreglo[i])).events) //Si es la columna 1, ponga los eventos
                let eventos = document.createTextNode(arreglo[i].events)
                console.log(typeof(arreglo[i].events))
                columna.appendChild(eventos)
            }

            if (col == 2){
                //let ardilla = document.createTextNode(JSON.parse(JSON.stringify(arreglo[i])).squirrel) //Si es la columna 2, ponga squirrel
                let ardilla = document.createTextNode(arreglo[i].squirrel) 
                columna.appendChild(ardilla)
            }
                
            fila.appendChild(columna);
            } 
        tabla.appendChild(fila);
    }
}



function correlacion(eventos,arreglo){
    //Retorna una lista de objetos json con el nombre del evento y la correlacion
    let lista_corr = [];

    //Para cada evento en la lista se calcula tp,tn,fp,fn
    for(j=0; j < eventos.length; j++){

        var dict = {
            nombre_evento: eventos[j],
            corr_evento: 0
          };

        let corr = 0;

        let tp =0;
        let tn =0;
        let fn =0;
        let fp =0;
        for (i=0; i < arreglo.length; i++){ 
            if (JSON.stringify(arreglo[i].events).includes(eventos[j])){
                if(arreglo[i].squirrel==true){
                    tp++;
                }
                if (arreglo[i].squirrel==false){
                    fn++
                }
            }
            else if(!JSON.stringify(arreglo[i].events).includes(eventos[j])){
                if(arreglo[i].squirrel==true){
                    fp++;
                }
                if (arreglo[i].squirrel==false){
                    tn++
                }
            }
            
        }

        //Con los valores de fp,vp,vn y fn se calcula la correlacion y se le asigna al objeto
        corr = ((tp*tn)-(fp*fn))/ (Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn)))
        dict.corr_evento=corr;

        //Se anade el objeto json a la lista
        lista_corr.push(dict);
        }

    //ordenar la lista para que las correlaciones mas altas sean las primeras    
    lista_corr.sort((a, b) => {
        return b.corr_evento - a.corr_evento;
    });
    
    return lista_corr;
}


function crearTablaCorr(arreglo){

    //Traer elemento de la segunda tabla 
    const tabla = document.getElementById("tbody2")

    for (let i = 0; i < arreglo.length; i++){

        // Crea una fila para cada evento
        let fila = document.createElement("tr") 

        //A cada columna, separela entre el numero del dato, el evento y la correlacion
        for (col = 0; col < 3; col++){ 
            let columna = document.createElement("td")
            if(col == 0) { 
                //Si es la columna 0, ponga el numero del dato
                let num = document.createTextNode(i) 
                columna.appendChild(num)
            } 
            if (col == 1){
                //Si es la columna 1, ponga el nombre del evento
                let evento = document.createTextNode(arreglo[i].nombre_evento)
                columna.appendChild(evento)
            }

            if (col == 2){
                //Si es la columna 2, ponga la correlacion
                let corr = document.createTextNode(arreglo[i].corr_evento) 
                columna.appendChild(corr)
            }
                
            fila.appendChild(columna);
            } 
        tabla.appendChild(fila);
    }
}