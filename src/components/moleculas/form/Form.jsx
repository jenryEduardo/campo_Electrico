import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../atoms/Button/Button";

const k_e = 8.99 * Math.pow(10, 9); // Constante de Coulomb

const Form = () => {
    const [campoElectrico, setCampoElectrico] = useState([0, 0, 0]); // Campo eléctrico en formato [x, y, z]
    const [charges, setCharges] = useState([
        { value: 0, position: [0, 0, 0] }, // Carga 1
        { value: 0, position: [0, 0, 0] }, // Carga 2
        { value: 0, position: [0, 0, 0] }  // Carga 3
    ]);
    const [result, setResult] = useState(null);

    const handleCampoChange = (index, value) => {
        const newCampo = [...campoElectrico];
        newCampo[index] = parseFloat(value);
        setCampoElectrico(newCampo);
    };

    const handleChargeChange = (index, value) => {
        const newCharges = [...charges];
        newCharges[index].value = value;
        setCharges(newCharges);
    };

    const handlePositionChange = (index, coordIndex, value) => {
        const newCharges = [...charges];
        newCharges[index].position[coordIndex] = parseFloat(value);
        setCharges(newCharges);
    };

    const calculateElectricField = () => {
        let ET = [0, 0, 0]; // Vector del campo eléctrico total

        // Primero, sumamos el campo eléctrico ingresado por el usuario
        ET = ET.map((component, index) => component + campoElectrico[index]);

        charges.forEach(charge => {
            const { value, position } = charge;
            const r = Math.sqrt(position.reduce((acc, curr) => acc + Math.pow(curr, 2), 0));
            const unitVector = position.map(coord => coord / r); // Vector unitario

            const E = k_e * (value * Math.pow(10, -6)) / Math.pow(r, 2); // Campo eléctrico
            ET = ET.map((component, index) => component + E * unitVector[index]); // Sumar vectores
        });

        setResult(ET);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        calculateElectricField();
    };

    return (
        <div className="container mt-5">
            <h1>Cálculo del Campo Eléctrico</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <h5>Campo Eléctrico (en N/C):</h5>
                    <input
                        type="number"
                        className="form-control w-25"
                        placeholder="E_x"
                        value={campoElectrico[0]}
                        onChange={(e) => handleCampoChange(0, e.target.value)}
                    />
                    <input
                        type="number"
                        className="form-control w-25"
                        placeholder="E_y"
                        value={campoElectrico[1]}
                        onChange={(e) => handleCampoChange(1, e.target.value)}
                    />
                    <input
                        type="number"
                        className="form-control w-25"
                        placeholder="E_z"
                        value={campoElectrico[2]}
                        onChange={(e) => handleCampoChange(2, e.target.value)}
                    />
                </div>

                {charges.map((charge, index) => (
                    <div key={index} className="mb-3">
                        <h5>Carga {index + 1} (en μC):</h5>
                        <input
                            type="number"
                            className="form-control w-50"
                            placeholder={`Ingrese carga ${index + 1}`}
                            value={charge.value}
                            onChange={(e) => handleChargeChange(index, e.target.value)}
                        />
                        <div>
                            <input
                                type="number"
                                className="form-control w-25"
                                placeholder="x"
                                onChange={(e) => handlePositionChange(index, 0, e.target.value)}
                            />
                            <input
                                type="number"
                                className="form-control w-25"
                                placeholder="y"
                                onChange={(e) => handlePositionChange(index, 1, e.target.value)}
                            />
                            <input
                                type="number"
                                className="form-control w-25"
                                placeholder="z"
                                onChange={(e) => handlePositionChange(index, 2, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                <Button texto={"Calcular"} />
            </form>
            {result && (
                <div>
                    <h2>Campo Eléctrico Total: ( {result[0].toFixed(2)} , {result[1].toFixed(2)} , {result[2].toFixed(2)} ) N/C</h2>
                </div>
            )}
        </div>
    );
}

export default Form;
