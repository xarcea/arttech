import * as React from "react";
import "./Items.css";
import { Button } from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';

const items = [
    {
        img_src: "/storage/app/public/assets/imgs/item1.jpg",
        nombre: "Manuscrito medieval",
        ubicacion: "Sala de Libros",
        estado: "Delicado (digitalizado y con acceso restringido)",
        ult_inspeccion: "19 de septiembre del 2023",
    },
    {
        img_src: "/storage/app/public/assets/imgs/item2.jpg",
        nombre: 'Obra de arte: "Paisaje con flores" de Van Gogh',
        ubicacion: "Sala de impresionismo",
        estado: "Bueno (con monitorizacion de temperatura y humedad)",
        ult_inspeccion: "5 de abril del 2024",
    },
    {
        img_src: "/storage/app/public/assets/imgs/item3.jpg",
        nombre: "Anfora romana",
        ubicacion: "Sala de artefactos romanos",
        estado: "Fragmentado (reparado)",
        ult_inspeccion: "8 de noviembre del 2023",
    },
    {
        img_src: "/storage/app/public/assets/imgs/item4.jpg",
        nombre: "Fosil de dinosaurio",
        ubicacion: "Sala de Historia Natural",
        estado: "Fragmentado (montado y en exhibicion)",
        ult_inspeccion: "16 de junio del 2023",
    },
];

const handleSubmit = async (event) => {
    event.preventDefault();
};

export const Items = () => {
    return (
        <>
            <div className="it-body">
                <div className="it-contenedor">
                    <h2>Registro de items</h2>
                </div>
                <div className="it-contenedor2">
                    {items.map((reg) => (
                        <div className="it-componente">
                            <div className="it-contenedor3">
                                <img className="it-img" src={reg.src} />
                                <EditNoteIcon sx={{ fontSize: 45}}/>
                            </div>
                            <p><b>{reg.nombre}</b></p>
                            <p><b>{`Ubicacion: ${reg.ubicacion}`}</b></p>
                            <p><b>{`Estado: ${reg.estado}`}</b></p>
                            <p><b>{`Ultima inspeccion: ${reg.ult_inspeccion}`}</b></p>
                        </div>
                    ))}
                </div>
                <div className="it-contenedor">
                    <form className="it-form" onSubmit={handleSubmit}>
                        <div className="it-form-boton">
                            <Button
                                type="submit"
                                className="it-boton-enviar"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#b5aa98",
                                    borderColor: "#8f7f65",
                                    borderWidth: "5px",
                                    borderStyle: "solid",
                                    color: "black",
                                    borderRadius: "20px"
                                }}
                            >
                                Agregar registro
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Items;
