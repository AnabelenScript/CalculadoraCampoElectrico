import React, { useState } from 'react';
import './main.css'


const ElectricFieldCalculator = () => {
    const epsilon0 = 8.854187817e-12;
    const [numCargas, setNumCargas] = useState(1);
    const [posicion, setPosicion] = useState({ x: 0, y: 0, z: 0 });
    const [unidadesPosicion, setUnidadesPosicion] = useState(1);
    const [cargas, setCargas] = useState([]);

    const generarEntradas = () => {
        const nuevasCargas = Array.from({ length: numCargas }, (_, i) => ({
            q: '',
            unidad: '1e-6',
            x: '',
            y: '',
            z: '',
            unidadPosicion: '1'
        }));
        setCargas(nuevasCargas);
    };

    const actualizarCarga = (index, campo, valor) => {
        const nuevasCargas = [...cargas];
        nuevasCargas[index][campo] = valor;
        setCargas(nuevasCargas);
    };

    const calcularCampo = () => {
        const posX = parseFloat(posicion.x) * unidadesPosicion;
        const posY = parseFloat(posicion.y) * unidadesPosicion;
        const posZ = parseFloat(posicion.z) * unidadesPosicion;
        let Ex = 0, Ey = 0, Ez = 0;
        let procedimientoHTML = `<strong>Posición donde se calcula el campo: (${posX} m, ${posY} m, ${posZ} m)</strong><br>`;

        cargas.forEach((carga, i) => {
            const qReal = parseFloat(carga.q) * parseFloat(carga.unidad);
            const xMetros = parseFloat(carga.x) * parseFloat(carga.unidadPosicion);
            const yMetros = parseFloat(carga.y) * parseFloat(carga.unidadPosicion);
            const zMetros = parseFloat(carga.z) * parseFloat(carga.unidadPosicion);

            const rx = posX - xMetros;
            const ry = posY - yMetros;
            const rz = posZ - zMetros;

            const r = Math.sqrt(rx ** 2 + ry ** 2 + rz ** 2);
            const factor = (1 / (4 * Math.PI * epsilon0)) * (qReal / r ** 3);

            const Ex_i = factor * rx;
            const Ey_i = factor * ry;
            const Ez_i = factor * rz;

            Ex += Ex_i;
            Ey += Ey_i;
            Ez += Ez_i;

            procedimientoHTML += `<h4>Carga ${i + 1}:</h4>`;
            procedimientoHTML += `Magnitud de la carga (C): ${qReal} C<br>`;
            procedimientoHTML += `Posición de la carga (m): (${xMetros}, ${yMetros}, ${zMetros})<br>`;
            procedimientoHTML += `Vector de posición relativo (r): (${rx}, ${ry}, ${rz})<br>`;
            procedimientoHTML += `Distancia r: ${r.toFixed(3)} m<br>`;
            procedimientoHTML += `Componente del campo eléctrico:<br>`;
            procedimientoHTML += `E<sub>x</sub> = ${Ex_i.toFixed(6)} , E<sub>y</sub> = ${Ey_i.toFixed(6)} , E<sub>z</sub> = ${Ez_i.toFixed(6)} <br><br>`;
        });

        procedimientoHTML += `<h4><strong>Campo Eléctrico Total:</strong></h4>`;
        procedimientoHTML += `E<sub>x</sub> = ${Ex.toFixed(3)} <br>`;
        procedimientoHTML += `E<sub>y</sub> = ${Ey.toFixed(3)} <br>`;
        procedimientoHTML += `E<sub>z</sub> = ${Ez.toFixed(3)} <br>`;

        document.getElementById('procedimiento').innerHTML = procedimientoHTML;
        document.getElementById('resultado').innerHTML = `E = (${Ex.toFixed(3)} i, ${Ey.toFixed(3)} j, ${Ez.toFixed(3)} k) `;
    };

    return (
        <div className='container'>
            <h1>Calculadora de Campo Eléctrico de 1 - 5 cargas</h1><br></br>

            <div className='generator'>
                <label htmlFor="numCargas">Número de cargas (1-5):</label>
                <input
                    type="number"
                    id="numCargas"
                    min="1"
                    max="5"
                    value={numCargas}
                    onChange={(e) => setNumCargas(e.target.value)}
                />
                <button onClick={generarEntradas}>Generar entradas</button>
            </div>

            <div>
                <h2>Posición para calcular el campo eléctrico (x, y, z):</h2><div className='campoElectrico'><br></br>
                <label htmlFor="posX">x:</label>
                <input
                    type="number"
                    id="posX"
                    value={posicion.x}
                    onChange={(e) => setPosicion({ ...posicion, x: e.target.value })}
                />
                <label htmlFor="posY">y:</label>
                <input
                    type="number"
                    id="posY"
                    value={posicion.y}
                    onChange={(e) => setPosicion({ ...posicion, y: e.target.value })}
                />
                <label htmlFor="posZ">z:</label>
                <input
                    type="number"
                    id="posZ"
                    value={posicion.z}
                    onChange={(e) => setPosicion({ ...posicion, z: e.target.value })}
                />
                <select
                    id="unidadPosicion"
                    value={unidadesPosicion}
                    onChange={(e) => setUnidadesPosicion(e.target.value)}
                >
                    <option value="1">m (metros)</option>
                    <option value="0.0254">pulgadas</option>
                    <option value="0.3048">pies</option>
                    <option value="0.9144">yardas</option>
                    <option value="1852">millas náuticas</option>
                </select>
                </div>
            </div>

            <div>
                {cargas.map((carga, i) => (
                    <div key={i}>
                        <h3>Q{i + 1}</h3>
                        <div className='campoElectrico'>
                        <label htmlFor={`q${i}`}>Magnitud de la carga:</label>
                        <input
                            type="number"
                            id={`q${i}`}
                            value={carga.q}
                            onChange={(e) => actualizarCarga(i, 'q', e.target.value)}
                        />
                        <select
                            id={`unidad${i}`}
                            value={carga.unidad}
                            onChange={(e) => actualizarCarga(i, 'unidad', e.target.value)}
                        >
                            <option value="1e-3">mC (milicoulombs)</option>
                            <option value="1e-6">μC (microcoulombs)</option>
                            <option value="1e-9">nC (nanocoulombs)</option>
                            <option value="1e-12">pC (picocoulombs)</option>
                            <option value="1e6">MC (megacoulombs)</option>
                        </select><br></br></div><div className='campoElectrico'>
                        <label htmlFor="">Posición espacial:</label>
                        <label htmlFor={`x${i}`}>x:</label>
                        <input
                            type="number"
                            id={`x${i}`}
                            value={carga.x}
                            onChange={(e) => actualizarCarga(i, 'x', e.target.value)}
                        />
                        <label htmlFor={`y${i}`}>y:</label>
                        <input
                            type="number"
                            id={`y${i}`}
                            value={carga.y}
                            onChange={(e) => actualizarCarga(i, 'y', e.target.value)}
                        />
                        <label htmlFor={`z${i}`}>z:</label>
                        <input
                            type="number"
                            id={`z${i}`}
                            value={carga.z}
                            onChange={(e) => actualizarCarga(i, 'z', e.target.value)}
                        />
                        <select
                            id={`unidadPosicionCarga${i}`}
                            value={carga.unidadPosicion}
                            onChange={(e) => actualizarCarga(i, 'unidadPosicion', e.target.value)}
                        >
                            <option value="1">m (metros)</option>
                            <option value="0.0254">pulgadas</option>
                            <option value="0.3048">pies</option>
                            <option value="0.9144">yardas</option>
                            <option value="1852">millas náuticas</option>
                        </select></div>
                    </div>
                ))}
            </div>
            <div className='resultButton'>
            <button onClick={calcularCampo} >Calcular Campo Eléctrico</button></div>

            <h2>Procedimiento:</h2>
            <div id="procedimiento"></div>

            <h2>Resultado:</h2>
            <p id="resultado"></p>
        </div>
    );
};

export default ElectricFieldCalculator;
