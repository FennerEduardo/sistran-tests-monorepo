import React from 'react';
import { Accordion } from 'react-bootstrap';

const QAResponses: React.FC = () => {
    return (
        <div>
            <h2>Respuestas a Preguntas Teóricas</h2>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Prueba React</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li><strong>1. ¿Qué error hay en este uso de useEffect?</strong><br/>Respuesta C: El array de dependencias debe ser un array []. (La opción C es correcta porque se pasó `props.value` directamente en vez de `[props.value]`).</li>
                            <li><strong>2. ¿Qué ocurre con este estado en React?</strong><br/>Respuesta B: Ambas llamadas usan el mismo valor anterior, así que solo incrementa una vez. (El estado se encola sin función callback `prev => prev + 1`).</li>
                            <li><strong>3. ¿Por qué este useContext no actualiza los valores en un componente hijo?</strong><br/>Respuesta C: El estado cart no está ligado a useState, por eso no se detectan cambios. (React solo re-renderiza si la referencia o el estado cambia, una constante `[]` no dispara renders).</li>
                            <li><strong>4. ¿Cuál es el problema en este useEffect?</strong><br/>Respuesta D: Si fetchData depende de props o estado, debería incluirse en el array de dependencias. (Regla de exhaust-deps).</li>
                            <li><strong>5. ¿Qué sucede con el siguiente useReducer?</strong><br/>Respuesta B: El estado está siendo mutado directamente; debería retornar una copia nueva. (`state.count += 1` muta el estado original).</li>
                            <li><strong>6. ¿Por qué no funciona el botón en este componente?</strong><br/>Respuesta B: La función handleClick() se ejecuta inmediatamente al renderizar. (Se pasan los paréntesis de ejecución en vez de la referencia).</li>
                            <li><strong>7. ¿Qué está mal con el siguiente uso de useState y renderizado?</strong><br/>Respuesta C: El input podría mostrar undefined; se recomienda iniciar con ''. (Evitar componentes no controlados).</li>
                            <li><strong>8. ¿Qué problema puede causar este patrón con useEffect y estado?</strong><br/>Respuesta B: Esto puede generar un bucle infinito de actualizaciones. (El efecto modifica la dependencia que lo dispara).</li>
                            <li><strong>9. ¿Cuál es un problema común al usar useContext de forma anidada?</strong><br/>Respuesta C: Si alguno de los contextos no tiene un Provider padre, retornará undefined. (Asumiendo que no hay default values).</li>
                            <li><strong>10. ¿Cuál es un riesgo al actualizar objetos con useState así?</strong><br/>Respuesta A: Si user no cambia de referencia, React no vuelve a renderizar. (Se debe esparcir `...user` o cambiar referencia).</li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Prueba .NET & SQL</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li><strong>1. ¿Cuál es el resultado después de ejecutar el algoritmo?</strong><br/>Respuesta D: Resultado 1: 69, Resultado 2: 49. (Se iteran las personas, la mayor edad a la fecha actual es 69 y el promedio calculado al sumar y dividir entre Length es 49).</li>
                            <li><strong>2. ¿Cuál de las siguientes opciones muestra la información completa?</strong><br/>Respuesta D: a y b son correctas. (Tanto `Console.WriteLine` con `{0}` como la concatenación `+` son métodos válidos en C#).</li>
                            <li><strong>3. Concepto Siglas M.V.C:</strong><br/>Respuesta A: Es un patrón de diseño útil para componentes de presentación.</li>
                            <li><strong>4. Patrón que garantiza instanciar una única vez (Singleton):</strong><br/>Respuesta D: Ninguna de las anteriores. (El patrón correcto es Singleton y no está en la lista).</li>
                            <li><strong>5. Definición O.R.M:</strong><br/>Respuesta B: Es una técnica de programación que permite convertir datos entre una base de datos relacional y el sistema de tipos.</li>
                            <li><strong>6. SQL órdenes >= 5:</strong><br/>Respuesta B: Usa correctamente `GROUP BY` y luego `HAVING COUNT >= 5`.</li>
                            <li><strong>7. Edad no se encuentra entre 40 y 50:</strong><br/>Respuesta D: Usa `not Between (40,50)`.</li>
                            <li><strong>8. Empleados comienzan con Lu:</strong><br/>Respuesta C: `LIKE 'Lu%'`.</li>
                            <li><strong>9. Empleados con cantidad de órdenes, incluir los que no tienen:</strong><br/>Respuesta D: Usa `LEFT JOIN`.</li>
                            <li><strong>10. Filtrado listItems JavaScript:</strong><br/>Respuesta A: Utiliza `autocomplete` correctamente y itera armando listas.</li>
                            <li><strong>11. JavaScript RegExp validaciones:</strong><br/>Respuesta D: I:1, II:3 y III:11. (I evalúa `nombre`, II evalúa el largo de `identificacion` y III lanza error de H o M).</li>
                            <li><strong>12. Sentencia LINQ válida:</strong><br/>Respuesta A: `from num in numeros where (num % 2 == 0) select num;`.</li>
                            <li><strong>13. WCF XML serialization:</strong><br/>Respuesta A: `[MessageContract(IsWrapped = false)]`.</li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default QAResponses;
