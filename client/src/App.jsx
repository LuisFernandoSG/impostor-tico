import { useEffect, useMemo, useState } from 'react';
import { TOPICS, getTopicById } from './data/topics.js';

const ROLE_LABELS = {
  explorer: 'Jugador',
  impostor: 'Impostor',
  'mr-nothing': 'Mr. Nothing'
};

let playerCounter = 0;
const createPlayer = (customName) => {
  playerCounter += 1;
  return {
    id: `player-${playerCounter}-${Math.random().toString(36).slice(2, 7)}`,
    name: customName ?? `Jugador ${playerCounter}`
  };
};

const createInitialPlayers = (count = 6) => {
  playerCounter = 0;
  return Array.from({ length: count }, (_, index) => createPlayer(`Jugador ${index + 1}`));
};

const shuffle = (list) => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z\d\s]/g, '')
    .trim();

const useAutoDismissMessage = (message, onClear, delay = 4200) => {
  useEffect(() => {
    if (!message) {
      return () => {};
    }
    const timer = setTimeout(() => onClear(null), delay);
    return () => clearTimeout(timer);
  }, [message, onClear, delay]);
};

const InfoPill = ({ icon, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-moss-700 shadow-sm">
    <span aria-hidden>{icon}</span>
    {label}
  </span>
);

const SectionCard = ({ title, description, children, accent }) => (
  <section
    className={`rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(31,64,55,0.45)] backdrop-blur ${
      accent ? 'ring-1 ring-inset ring-holly-100/70' : ''
    }`}
  >
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold text-moss-900 sm:text-xl">{title}</h2>
      {description ? <p className="text-sm text-moss-600">{description}</p> : null}
    </div>
    <div className="mt-4 flex flex-col gap-4">{children}</div>
  </section>
);

const TopicButton = ({ topic, active, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(topic.id)}
    className={`group flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
      active
        ? 'border-holly-400/80 bg-holly-50/80 text-holly-700 shadow-inner shadow-holly-200/60'
        : 'border-snow-200/80 bg-white/60 text-moss-700 hover:border-holly-200/60 hover:bg-holly-50/40'
    }`}
  >
    <span className="mt-0.5 text-lg" aria-hidden>
      {topic.icon}
    </span>
    <span className="flex-1">
      <span className="block text-sm font-semibold">{topic.name}</span>
      <span className="block text-xs leading-relaxed text-moss-500">{topic.description}</span>
    </span>
    <span
      aria-hidden
      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-black transition ${
        active
          ? 'border-transparent bg-holly-500 text-white'
          : 'border-snow-300 bg-white text-snow-400 group-hover:border-holly-200 group-hover:text-holly-400'
      }`}
    >
      {active ? '✓' : '+'}
    </span>
  </button>
);

const RoleAdjuster = ({ label, value, onDecrement, onIncrement, minLabel, maxLabel }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-snow-200/70 bg-white/70 p-4 shadow-inner">
    <div className="flex items-center justify-between text-sm font-semibold text-moss-800">
      <span>{label}</span>
      <span className="text-xs font-medium text-moss-500">
        {minLabel} – {maxLabel}
      </span>
    </div>
    <div className="flex items-center justify-between rounded-2xl bg-white/90 p-2 shadow-sm">
      <button
        type="button"
        onClick={onDecrement}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-snow-200 bg-white text-lg text-moss-600 transition hover:border-holly-200 hover:text-holly-500"
      >
        −
      </button>
      <span className="text-2xl font-black text-moss-900">{value}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-snow-200 bg-white text-lg text-moss-600 transition hover:border-holly-200 hover:text-holly-500"
      >
        +
      </button>
    </div>
  </div>
);

const PlayerRow = ({ index, player, onRename, onRemove, canRemove }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-snow-200/80 bg-white/70 p-3 shadow-sm sm:flex-row sm:items-center sm:gap-4">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-holly-100 to-holly-200 text-sm font-black text-holly-800">
        {index + 1}
      </span>
      <input
        value={player.name}
        onChange={(event) => onRename(player.id, event.target.value)}
        placeholder={`Jugador ${index + 1}`}
        className="flex-1 rounded-2xl border border-transparent bg-white/90 px-3 py-2 text-sm font-semibold text-moss-900 shadow-inner shadow-white/50 transition focus:border-holly-300 focus:outline-none"
      />
    </div>
    <button
      type="button"
      onClick={() => onRemove(player.id)}
      disabled={!canRemove}
      className="ml-auto inline-flex items-center justify-center rounded-2xl border border-transparent px-3 py-2 text-xs font-semibold text-berry-600 transition hover:bg-berry-50 disabled:cursor-not-allowed disabled:text-snow-400"
    >
      Quitar
    </button>
  </div>
);

const PlayerCard = ({ player, revealMode, onReveal, onEliminate, isLocked }) => {
  const roleLabel = ROLE_LABELS[player.role];
  const showRole = revealMode === 'visible';
  const status = player.eliminated ? 'eliminated' : player.revealed ? 'revealed' : 'hidden';

  return (
    <article
      className={`flex flex-col gap-4 rounded-3xl border p-5 shadow-lg transition ${
        player.eliminated
          ? 'border-berry-200/70 bg-berry-50/70 text-berry-700'
          : 'border-snow-200/70 bg-white/80 text-moss-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-moss-900">{player.name}</h3>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-moss-500">
            {showRole ? roleLabel : 'Rol oculto'}
          </span>
        </div>
        <InfoPill
          icon={player.eliminated ? '🚪' : showRole ? (player.role === 'impostor' ? '🕵️' : '🧑‍🤝‍🧑') : '🎭'}
          label={player.eliminated ? 'Fuera' : showRole ? roleLabel : 'En juego'}
        />
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 rounded-2xl border border-dashed p-4 text-sm transition ${
          status === 'revealed'
            ? 'border-holly-300/80 bg-holly-50/60 text-holly-800'
            : 'border-snow-300/80 bg-white/60 text-moss-600'
        }`}
      >
        <p className="leading-relaxed">
          {status === 'revealed'
            ? player.role === 'mr-nothing'
              ? 'No tienes pista. Improvisa y observa a los demás.'
              : player.role === 'impostor'
                ? `Pista secreta: ${player.clue}`
                : `Palabra secreta: ${player.clue}`
            : 'Toca “Mostrar pista” para revelar la carta de este jugador.'}
        </p>
        <button
          type="button"
          onClick={() => onReveal(player.id)}
          disabled={player.eliminated}
          className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
            player.eliminated
              ? 'border-transparent bg-berry-100/60 text-berry-400'
              : status === 'revealed'
                ? 'border-holly-400/70 bg-holly-100/70 text-holly-700 hover:bg-holly-200/70'
                : 'border-snow-300 bg-white/80 text-moss-600 hover:border-holly-200 hover:text-holly-500'
          }`}
        >
          {status === 'revealed' ? 'Ocultar pista' : 'Mostrar pista'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onEliminate(player.id)}
        disabled={player.eliminated || isLocked}
        className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${
          player.eliminated
            ? 'bg-berry-100/70 text-berry-400'
            : 'bg-gradient-to-r from-berry-500 to-ginger-400 text-white shadow-md hover:from-berry-600 hover:to-ginger-500'
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {player.eliminated ? 'Expulsado' : 'Votar expulsión'}
      </button>
    </article>
  );
};

const Timeline = ({ entries }) => (
  <div className="rounded-3xl border border-white/60 bg-white/70 p-4 text-sm text-moss-600 shadow-inner">
    <h3 className="text-sm font-semibold text-moss-800">Bitácora de la ronda</h3>
    {entries.length === 0 ? (
      <p className="mt-2 text-xs text-moss-500">Las votaciones e intentos aparecerán aquí.</p>
    ) : (
      <ol className="mt-3 space-y-2 text-xs">
        {entries.map((entry) => (
          <li key={entry.timestamp} className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
            <span className="font-semibold text-moss-700">{entry.label}</span>
            <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-moss-400">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ol>
    )}
  </div>
);

const RulesCard = () => {
  const rules = [
    'Todos los jugadores comparten la misma palabra, excepto el impostor.',
    'El impostor solo ve una pista relacionada con la palabra.',
    'Mr. Nothing no recibe nada: debe improvisar sin revelar que está perdido.',
    'Tras cada ronda de debate, voten a alguien. Si es impostor, el equipo gana.',
    'Si expulsan a Mr. Nothing deberá adivinar la palabra secreta.',
    'La partida termina cuando no quedan impostores y Mr. Nothing fuera de juego, o si un impostor queda mano a mano con un jugador.'
  ];

  return (
    <SectionCard title="Cómo se juega" description="Repasa las reglas rápidas antes de comenzar la misión secreta." accent>
      <ul className="space-y-2 text-sm text-moss-600">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-base text-holly-500">
              •
            </span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

const FeedbackBanner = ({ feedback, onClose }) => {
  if (!feedback) {
    return null;
  }

  const palette =
    feedback.type === 'error'
      ? 'border-berry-300/80 bg-berry-50/70 text-berry-700'
      : feedback.type === 'success'
        ? 'border-holly-300/80 bg-holly-50/70 text-holly-700'
        : 'border-snow-300/80 bg-white/80 text-moss-700';

  return (
    <div className={`flex items-start gap-3 rounded-3xl border px-4 py-3 text-sm shadow ${palette}`}>
      <span aria-hidden>{feedback.type === 'error' ? '⚠️' : feedback.type === 'success' ? '✨' : '💡'}</span>
      <span className="flex-1 leading-relaxed">{feedback.message}</span>
      <button type="button" onClick={onClose} className="text-xs font-semibold text-moss-500 hover:text-moss-700">
        Cerrar
      </button>
    </div>
  );
};

const GameSummary = ({ game, onRestart, onConfigure }) => (
  <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-moss-900">Partida en curso</h2>
        <p className="text-sm text-moss-600">Comparte el dispositivo para revelar pistas individualmente.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-2xl border border-snow-200/70 bg-white/80 px-3 py-2 text-xs font-semibold text-moss-600 transition hover:border-holly-200 hover:text-holly-500"
        >
          Reiniciar partida
        </button>
        <button
          type="button"
          onClick={onConfigure}
          className="inline-flex items-center gap-2 rounded-2xl border border-transparent bg-gradient-to-r from-holly-500 to-ginger-400 px-3 py-2 text-xs font-semibold text-white shadow-md hover:from-holly-600 hover:to-ginger-500"
        >
          Configurar nueva ronda
        </button>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-holly-200/70 bg-holly-50/70 p-4 text-sm text-holly-700">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-holly-500">Palabra secreta</span>
        <p className="mt-2 text-lg font-bold text-holly-700">{game.word}</p>
      </div>
      <div className="rounded-2xl border border-ginger-200/70 bg-ginger-50/70 p-4 text-sm text-ginger-700">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ginger-500">Pista del impostor</span>
        <p className="mt-2 text-lg font-bold text-ginger-700">{game.hint}</p>
      </div>
      <div className="rounded-2xl border border-snow-200/70 bg-white/70 p-4 text-sm text-moss-600 sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-moss-500">Temáticas en juego</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {game.topicIds.map((topicId) => {
            const topic = getTopicById(topicId);
            if (!topic) return null;
            return <InfoPill key={topic.id} icon={topic.icon} label={topic.name} />;
          })}
        </div>
      </div>
    </div>
  </div>
);

const OutcomeBanner = ({ outcome }) => {
  if (!outcome) {
    return null;
  }
  const palette =
    outcome.type === 'impostors-win'
      ? 'from-berry-500 to-berry-700'
      : outcome.type === 'mr-guessed'
        ? 'from-ginger-400 to-holly-500'
        : 'from-holly-500 to-emerald-500';
  return (
    <div className={`rounded-3xl bg-gradient-to-r ${palette} px-6 py-5 text-white shadow-xl`}>
      <h3 className="text-lg font-black">{outcome.title}</h3>
      <p className="mt-1 text-sm text-white/80">{outcome.description}</p>
    </div>
  );
};

const MrNothingGuess = ({ player, onGuess, onCancel, feedback }) => {
  const [guess, setGuess] = useState('');

  useEffect(() => {
    setGuess('');
  }, [player?.id]);

  if (!player) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-holly-200/70 bg-holly-50/80 p-5 shadow-inner">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold text-holly-700">Turno de {player.name}</h3>
        <p className="text-sm text-holly-700/80">
          Mr. Nothing fue descubierto. Tiene una sola oportunidad para adivinar la palabra secreta. ¡Que no se note el nerviosismo!
        </p>
      </div>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          onGuess(guess);
        }}
      >
        <input
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="¿Cuál crees que es la palabra?"
          className="flex-1 rounded-2xl border border-transparent bg-white px-3 py-2 text-sm font-semibold text-holly-700 shadow-inner shadow-white/60 focus:border-holly-300 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-xs font-semibold text-holly-600 hover:border-holly-200"
          >
            Guardar silencio
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-holly-500 to-ginger-400 px-3 py-2 text-xs font-semibold text-white shadow hover:from-holly-600 hover:to-ginger-500"
          >
            Lanzar respuesta
          </button>
        </div>
      </form>
      {feedback ? (
        <p className={`mt-3 text-sm font-semibold ${feedback.success ? 'text-holly-700' : 'text-berry-600'}`}>
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
};

const App = () => {
  const [players, setPlayers] = useState(() => createInitialPlayers());
  const [impostorCount, setImpostorCount] = useState(1);
  const [mrNothingCount, setMrNothingCount] = useState(0);
  const [roleVisibility, setRoleVisibility] = useState('hidden');
  const [selectedTopics, setSelectedTopics] = useState(() => TOPICS.slice(0, 2).map((topic) => topic.id));
  const [feedback, setFeedback] = useState(null);
  const [game, setGame] = useState(null);

  useAutoDismissMessage(feedback, setFeedback);

  useEffect(() => {
    setImpostorCount((current) => {
      const max = Math.max(1, players.length - 1);
      const next = Math.min(Math.max(current, 1), max);
      return next;
    });
  }, [players.length]);

  useEffect(() => {
    setMrNothingCount((current) => {
      const max = Math.max(0, players.length - impostorCount - 1);
      return Math.min(current, max);
    });
  }, [players.length, impostorCount]);

  const aliveSummary = useMemo(() => {
    if (!game) {
      return null;
    }
    const alivePlayers = game.players.filter((player) => !player.eliminated);
    const impostorsAlive = alivePlayers.filter((player) => player.role === 'impostor').length;
    const mrAlive = alivePlayers.filter((player) => player.role === 'mr-nothing').length;
    const explorersAlive = alivePlayers.filter((player) => player.role === 'explorer').length;
    return { impostorsAlive, mrAlive, explorersAlive };
  }, [game]);

  const handleRenamePlayer = (playerId, newName) => {
    setPlayers((current) => current.map((player) => (player.id === playerId ? { ...player, name: newName } : player)));
  };

  const handleRemovePlayer = (playerId) => {
    setPlayers((current) => {
      if (current.length <= 3) {
        setFeedback({ type: 'error', message: 'Necesitas al menos 3 jugadores para comenzar una partida divertida.' });
        return current;
      }
      return current.filter((player) => player.id !== playerId);
    });
  };

  const handleAddPlayer = () => {
    setPlayers((current) => [...current, createPlayer()]);
  };

  const toggleTopic = (topicId) => {
    setSelectedTopics((current) => {
      if (current.includes(topicId)) {
        if (current.length === 1) {
          setFeedback({ type: 'error', message: 'Selecciona al menos un tema para generar palabras.' });
          return current;
        }
        return current.filter((id) => id !== topicId);
      }
      return [...current, topicId];
    });
  };

  const adjustImpostors = (delta) => {
    setImpostorCount((current) => {
      const max = Math.max(1, players.length - 1);
      const proposed = Math.min(Math.max(current + delta, 1), max);
      if (proposed !== current) {
        setMrNothingCount((mrCurrent) => {
          const maxMr = Math.max(0, players.length - proposed - 1);
          return Math.min(mrCurrent, maxMr);
        });
      }
      return proposed;
    });
  };

  const adjustMrNothing = (delta) => {
    setMrNothingCount((current) => {
      const max = Math.max(0, players.length - impostorCount - 1);
      return Math.min(Math.max(current + delta, 0), max);
    });
  };

  const startGame = () => {
    if (players.length < 3) {
      setFeedback({ type: 'error', message: 'Necesitas al menos 3 jugadores para comenzar la misión.' });
      return;
    }

    const sanitizedPlayers = players.map((player, index) => ({
      ...player,
      name: player.name.trim() || `Jugador ${index + 1}`
    }));

    setPlayers(sanitizedPlayers);

    if (sanitizedPlayers.length <= impostorCount) {
      setFeedback({
        type: 'error',
        message: 'Debe quedar al menos una persona inocente. Reduce el número de impostores.'
      });
      return;
    }

    if (sanitizedPlayers.length <= impostorCount + mrNothingCount) {
      setFeedback({
        type: 'error',
        message: 'Ajusta la cantidad de impostores o de Mr. Nothing para que exista al menos un jugador con palabra.'
      });
      return;
    }

    const wordPool = selectedTopics.flatMap((topicId) => {
      const topic = getTopicById(topicId);
      if (!topic) return [];
      return topic.words.map((entry) => ({ ...entry, topicId: topic.id }));
    });

    if (wordPool.length === 0) {
      setFeedback({ type: 'error', message: 'No encontramos palabras para los temas elegidos. Intenta con otros.' });
      return;
    }

    const chosenWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    const shuffledIds = shuffle(sanitizedPlayers.map((player) => player.id));
    const impostorIds = new Set(shuffledIds.slice(0, impostorCount));
    const mrNothingIds = new Set(shuffledIds.slice(impostorCount, impostorCount + mrNothingCount));

    const assignments = sanitizedPlayers.map((player) => {
      const role = impostorIds.has(player.id)
        ? 'impostor'
        : mrNothingIds.has(player.id)
          ? 'mr-nothing'
          : 'explorer';

      return {
        ...player,
        role,
        clue:
          role === 'explorer'
            ? chosenWord.word
            : role === 'impostor'
              ? chosenWord.hint
              : 'Mantén la calma y finge que sabes de qué hablan.',
        eliminated: false,
        revealed: false
      };
    });

    setGame({
      word: chosenWord.word,
      hint: chosenWord.hint,
      topicIds: selectedTopics,
      revealMode: roleVisibility,
      players: assignments,
      stage: 'active',
      outcome: null,
      mrNothingAwaitingGuess: null,
      guessFeedback: null,
      history: []
    });

    setFeedback({ type: 'success', message: 'La partida comenzó. Pasa el dispositivo de jugador en jugador.' });
  };

  const handleReveal = (playerId) => {
    if (!game) return;
    setGame((current) => ({
      ...current,
      players: current.players.map((player) =>
        player.id === playerId ? { ...player, revealed: !player.revealed } : player
      )
    }));
  };

  const handleEliminate = (playerId) => {
    setGame((current) => {
      if (!current || current.stage === 'finished') {
        return current;
      }
      const target = current.players.find((player) => player.id === playerId);
      if (!target || target.eliminated) {
        return current;
      }

      const updatedPlayers = current.players.map((player) =>
        player.id === playerId ? { ...player, eliminated: true } : player
      );

      const alivePlayers = updatedPlayers.filter((player) => !player.eliminated);
      const impostorsAlive = alivePlayers.filter((player) => player.role === 'impostor').length;
      const mrAlive = alivePlayers.filter((player) => player.role === 'mr-nothing').length;
      const explorersAlive = alivePlayers.filter((player) => player.role === 'explorer').length;

      let stage = current.stage;
      let outcome = current.outcome;
      let mrNothingAwaitingGuess = current.mrNothingAwaitingGuess;
      let guessFeedback = current.guessFeedback;

      if (target.role === 'mr-nothing') {
        mrNothingAwaitingGuess = target.id;
        guessFeedback = null;
      }

      if (target.role === 'impostor' && impostorsAlive === 0 && mrAlive === 0) {
        stage = 'finished';
        outcome = {
          type: 'explorers-win',
          title: '¡Descubrieron a todos los impostores!',
          description: 'Los jugadores protegieron la palabra secreta.'
        };
        mrNothingAwaitingGuess = null;
      } else if (target.role === 'impostor' && impostorsAlive === 0) {
        stage = 'active';
        outcome = {
          type: 'impostor-out',
          title: '¡Impostor fuera de juego!',
          description: 'Queda averiguar si Mr. Nothing adivina la palabra.'
        };
      }

      if (impostorsAlive > 0 && explorersAlive <= 1) {
        stage = 'finished';
        outcome = {
          type: 'impostors-win',
          title: 'Los impostores tomaron el control',
          description: 'Un impostor quedó frente a frente con el último jugador.'
        };
        mrNothingAwaitingGuess = null;
      }

      if (impostorsAlive === 0 && mrAlive === 0) {
        stage = 'finished';
        outcome = {
          type: 'explorers-win',
          title: 'Victoria total del equipo',
          description: 'No quedan impostores ni Mr. Nothing en juego.'
        };
        mrNothingAwaitingGuess = null;
      }

      const historyEntry = {
        timestamp: Date.now(),
        label: `Expulsaron a ${target.name}${
          target.role === 'impostor'
            ? ' (impostor)'
            : target.role === 'mr-nothing'
              ? ' (Mr. Nothing)'
              : ''
        }`
      };

      return {
        ...current,
        players: updatedPlayers,
        stage,
        outcome,
        mrNothingAwaitingGuess,
        guessFeedback,
        history: [historyEntry, ...current.history].slice(0, 12)
      };
    });
  };

  const handleMrGuess = (guess) => {
    setGame((current) => {
      if (!current || !current.mrNothingAwaitingGuess) {
        return current;
      }
      const mrPlayer = current.players.find((player) => player.id === current.mrNothingAwaitingGuess);
      if (!mrPlayer) {
        return current;
      }

      const normalizedGuess = normalize(guess);
      if (!normalizedGuess) {
        return {
          ...current,
          guessFeedback: { success: false, message: 'Necesitas proponer una palabra para intentarlo.' }
        };
      }

      const success = normalize(current.word) === normalizedGuess;
      const historyEntry = {
        timestamp: Date.now(),
        label: `${mrPlayer.name} intentó adivinar: “${guess.trim()}”${success ? ' ✅' : ' ❌'}`
      };

      let outcome = current.outcome;
      let stage = current.stage;

      if (success) {
        stage = 'finished';
        outcome = {
          type: 'mr-guessed',
          title: 'Mr. Nothing adivinó la palabra',
          description: '¡Qué giro inesperado! Ahora todos conocen la respuesta.'
        };
      }

      return {
        ...current,
        stage,
        outcome,
        mrNothingAwaitingGuess: null,
        guessFeedback: {
          success,
          message: success ? '¡Correcto! Mr. Nothing se redimió.' : 'Fallaste, pero aún pueden seguir jugando.'
        },
        history: [historyEntry, ...current.history].slice(0, 12)
      };
    });
  };

  const cancelMrGuess = () => {
    setGame((current) => {
      if (!current) return current;
      return { ...current, mrNothingAwaitingGuess: null };
    });
  };

  const goToSetup = () => {
    setGame(null);
    setFeedback({ type: 'info', message: 'Ajusta la configuración y vuelve a lanzar una partida.' });
  };

  const roleButtons = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setRoleVisibility('hidden')}
        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
          roleVisibility === 'hidden'
            ? 'border-holly-300/80 bg-holly-50/80 text-holly-700'
            : 'border-snow-200 bg-white text-moss-600 hover:border-holly-200'
        }`}
      >
        Roles ocultos
      </button>
      <button
        type="button"
        onClick={() => setRoleVisibility('visible')}
        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
          roleVisibility === 'visible'
            ? 'border-holly-300/80 bg-holly-50/80 text-holly-700'
            : 'border-snow-200 bg-white text-moss-600 hover:border-holly-200'
        }`}
      >
        Todos saben su rol
      </button>
    </div>
  );

  const aliveBadges = aliveSummary ? (
    <div className="flex flex-wrap gap-2 text-xs font-semibold text-moss-500">
      <InfoPill icon="🧑‍🤝‍🧑" label={`${aliveSummary.explorersAlive} jugadores`} />
      <InfoPill icon="🕵️" label={`${aliveSummary.impostorsAlive} impostores`} />
      <InfoPill icon="🫥" label={`${aliveSummary.mrAlive} Mr. Nothing`} />
    </div>
  ) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-holly-50 via-white to-berry-50 text-moss-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(92,196,143,0.18), transparent 65%), radial-gradient(circle at 90% 10%, rgba(255,182,193,0.18), transparent 55%), radial-gradient(circle at 85% 80%, rgba(255,212,150,0.2), transparent 55%)'
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 text-center sm:gap-6">
          <div className="mx-auto flex items-center gap-2 rounded-full bg-white/80 px-5 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-holly-600 shadow-sm">
            <span aria-hidden>🧩</span>
            <span>Fiesta del impostor</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-moss-900 sm:text-4xl lg:text-5xl">
            El Viral Impostor
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-moss-600 sm:text-base">
            Diseñado para jugar cara a cara. Configura la sala, comparte pistas personalizadas y deja que la intriga haga el resto.
          </p>
          {aliveBadges}
        </header>

        <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />

        {game ? (
          <div className="flex flex-col gap-8">
            <GameSummary game={game} onRestart={startGame} onConfigure={goToSetup} />
            <OutcomeBanner outcome={game.outcome} />
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {game.players.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      revealMode={game.revealMode}
                      onReveal={handleReveal}
                      onEliminate={handleEliminate}
                      isLocked={game.stage === 'finished'}
                    />
                  ))}
                </div>
                <MrNothingGuess
                  player={game.players.find((player) => player.id === game.mrNothingAwaitingGuess)}
                  onGuess={handleMrGuess}
                  onCancel={cancelMrGuess}
                  feedback={game.guessFeedback}
                />
              </div>
              <div className="flex flex-col gap-5">
                <Timeline entries={game.history} />
                <SectionCard title="Roles en esta ronda">
                  <ul className="space-y-2 text-sm text-moss-600">
                    <li className="flex items-start gap-2">
                      <span aria-hidden>🧑‍🤝‍🧑</span>
                      <span>Jugadores: conocen la palabra completa.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span aria-hidden>🕵️</span>
                      <span>Impostores: solo tienen una pista, deben improvisar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span aria-hidden>🫥</span>
                      <span>Mr. Nothing: no recibe pistas, pero puede salvarse adivinando.</span>
                    </li>
                  </ul>
                </SectionCard>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
            <div className="flex flex-col gap-6">
              <SectionCard
                title="1. Jugadores"
                description="Agrega a tus amigos, renombra a quien quieras y prepárense para sospechar de todos."
              >
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <PlayerRow
                      key={player.id}
                      index={index}
                      player={player}
                      onRename={handleRenamePlayer}
                      onRemove={handleRemovePlayer}
                      canRemove={players.length > 3}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-moss-400">
                  <span>Total: {players.length} jugadores</span>
                  <button
                    type="button"
                    onClick={handleAddPlayer}
                    className="inline-flex items-center gap-2 rounded-2xl border border-holly-300/80 bg-holly-50/80 px-3 py-2 text-[11px] font-semibold text-holly-700 transition hover:border-holly-400"
                  >
                    <span aria-hidden>+</span> Agregar jugador
                  </button>
                </div>
              </SectionCard>

              <SectionCard
                title="2. Roles especiales"
                description="Define cuántos impostores y Mr. Nothing habrá según el tamaño del grupo."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <RoleAdjuster
                    label="Impostores"
                    value={impostorCount}
                    onDecrement={() => adjustImpostors(-1)}
                    onIncrement={() => adjustImpostors(1)}
                    minLabel="Mín 1"
                    maxLabel={`Máx ${Math.max(1, players.length - 1)}`}
                  />
                  <RoleAdjuster
                    label="Mr. Nothing"
                    value={mrNothingCount}
                    onDecrement={() => adjustMrNothing(-1)}
                    onIncrement={() => adjustMrNothing(1)}
                    minLabel="Puede ser 0"
                    maxLabel={`Máx ${Math.max(0, players.length - impostorCount - 1)}`}
                  />
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-xs text-moss-600">
                  <p className="font-semibold text-moss-700">¿Mostrar roles?</p>
                  <p className="mt-2 text-xs text-moss-500">Puedes dejar los roles ocultos para más tensión o permitir que todos sepan su papel.</p>
                  <div className="mt-3">{roleButtons}</div>
                </div>
              </SectionCard>
            </div>

            <div className="flex flex-col gap-6">
              <SectionCard
                title="3. Temas y palabra secreta"
                description="Selecciona uno o varios temas para generar palabras personalizadas."
              >
                <div className="flex flex-col gap-3">
                  {TOPICS.map((topic) => (
                    <TopicButton key={topic.id} topic={topic} active={selectedTopics.includes(topic.id)} onToggle={toggleTopic} />
                  ))}
                </div>
              </SectionCard>
              <RulesCard />
            </div>
          </div>
        )}

        <div className="sticky bottom-6 mt-auto flex justify-center">
          <button
            type="button"
            onClick={startGame}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-holly-500 to-ginger-400 px-10 py-3 text-sm font-bold uppercase tracking-[0.3em] text-white shadow-xl transition hover:from-holly-600 hover:to-ginger-500"
          >
            {game ? 'Repartir nueva palabra' : 'Iniciar partida'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
