import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card.jsx';
import { TextField } from '../components/TextField.jsx';
import { Button } from '../components/Button.jsx';
import { Loader } from '../components/Loader.jsx';
import { useGroupsApi } from '../services/groups.js';
import {
  rememberAdminCode,
  rememberParticipantAccess,
  rememberParticipantForGroup
} from '../utils/storage.js';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { createGroup, addParticipant } = useGroupsApi();

  const [createFeedback, setCreateFeedback] = useState(null);
  const [joinFeedback, setJoinFeedback] = useState(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors },
    reset: resetCreate
  } = useForm({
    defaultValues: { name: '', ownerName: '', ownerEmail: '' }
  });

  const {
    register: registerJoin,
    handleSubmit: handleJoinSubmit,
    formState: { errors: joinErrors },
    reset: resetJoin
  } = useForm({
    defaultValues: { joinCode: '', name: '', email: '' }
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const onCreate = handleCreateSubmit(async (values) => {
    setCreateFeedback(null);
    setIsCreating(true);
    try {
      const payload = {
        name: values.name.trim(),
        ownerName: values.ownerName.trim(),
        ownerEmail: values.ownerEmail.trim()
      };

      const data = await createGroup(payload);

      rememberAdminCode(data.joinCode, data.adminCode);
      rememberParticipantAccess(data.hostParticipant.id, data.hostParticipant.accessCode);
      rememberParticipantForGroup(data.joinCode, data.hostParticipant.id);

      setCreateFeedback(`Grupo creado. Tu código es ${data.joinCode}.`);
      resetCreate();

      navigate(`/grupos/${data.joinCode}`, {
        state: { adminCode: data.adminCode }
      });
    } catch (error) {
      setCreateFeedback(error.message || 'No pudimos crear el grupo. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  });

  const onJoin = handleJoinSubmit(async (values) => {
    setJoinFeedback(null);
    setIsJoining(true);
    try {
      const joinCode = values.joinCode.trim().toUpperCase();
      const payload = { name: values.name.trim(), email: values.email.trim() };
      const data = await addParticipant(joinCode, payload);

      rememberParticipantAccess(data.participant.id, data.accessCode);
      rememberParticipantForGroup(joinCode, data.participant.id);

      resetJoin();

      navigate(`/grupos/${joinCode}/participantes/${data.participant.id}`, {
        state: { accessCode: data.accessCode }
      });
    } catch (error) {
      setJoinFeedback(error.message || 'No pudimos unirte al grupo. Revisa el código e inténtalo de nuevo.');
    } finally {
      setIsJoining(false);
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <Card
        title="Crea tu intercambio"
        description="Genera un grupo en segundos. Serás la primera persona dentro y podrás administrar las sorpresas."
      >
        <form className="flex flex-col gap-4" onSubmit={onCreate}>
          <TextField
            label="Nombre del grupo"
            placeholder="Familia Ramírez"
            {...registerCreate('name', { required: 'Ingresa un nombre para el grupo' })}
            error={createErrors.name?.message}
          />
          <TextField
            label="Tu nombre"
            placeholder="Ana"
            {...registerCreate('ownerName', { required: 'Necesitamos tu nombre' })}
            error={createErrors.ownerName?.message}
          />
          <TextField
            label="Correo (opcional)"
            placeholder="ana@email.com"
            type="email"
            {...registerCreate('ownerEmail')}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Loader label="Creando grupo…" /> : 'Crear grupo navideño'}
            </Button>
            <p className="text-[11px] text-white/70">
              Al crear el grupo quedarás registrado como participante y recibirás un código de administración.
            </p>
            {createFeedback ? <p className="text-xs text-brand-100">{createFeedback}</p> : null}
          </div>
        </form>
      </Card>

      <Card
        title="Únete a un intercambio"
        description="Escribe el código que te compartieron e ingresa tus datos para recibir tu enlace personal."
      >
        <form className="flex flex-col gap-4" onSubmit={onJoin}>
          <TextField
            label="Código del grupo"
            placeholder="ABCD1234"
            {...registerJoin('joinCode', {
              required: 'Ingresa el código que te compartieron',
              minLength: { value: 4, message: 'El código debe tener al menos 4 caracteres' }
            })}
            error={joinErrors.joinCode?.message}
          />
          <TextField
            label="Tu nombre"
            placeholder="María"
            {...registerJoin('name', { required: 'Ingresa tu nombre' })}
            error={joinErrors.name?.message}
          />
          <TextField
            label="Correo (opcional)"
            placeholder="maria@email.com"
            type="email"
            {...registerJoin('email')}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" variant="secondary" disabled={isJoining}>
              {isJoining ? <Loader label="Uniéndote…" /> : 'Unirme ahora'}
            </Button>
            <p className="text-[11px] text-white/70">
              Guarda el enlace al que te enviaremos para administrar tu lista de deseos y ver a quién regalarás.
            </p>
            {joinFeedback ? <p className="text-xs text-brand-100">{joinFeedback}</p> : null}
          </div>
        </form>
      </Card>
    </div>
  );
};
