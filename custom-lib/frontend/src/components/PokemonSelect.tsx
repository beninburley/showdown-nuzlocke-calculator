// src/components/PokemonSelect.tsx
import React, { useState } from "react";
import { Pokedex } from "../../../../data/pokedex";
import { Natures } from "../../../../data/natures";

type PokemonKey = keyof typeof Pokedex;
type StatKey = keyof (typeof Pokedex)[PokemonKey]["baseStats"];
type NatureKey = keyof typeof Natures;
type Nature = (typeof Natures)[NatureKey];

const statKeys: StatKey[] = ["hp", "atk", "def", "spa", "spd", "spe"];

function calculateStat(
	base: number,
	iv: number,
	ev: number,
	level: number,
	isHP: boolean,
	nature: Nature | null,
	statKey: StatKey
): number {
	if (isHP) {
		return (
			Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) +
			level +
			10
		);
	} else {
		const stat =
			Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
		const mod = nature
			? nature.plus === statKey
				? 1.1
				: nature.minus === statKey
				? 0.9
				: 1
			: 1;
		return Math.floor(stat * mod);
	}
}
interface PokemonSelectProps {
	onSelect?: (pokemonKey: PokemonKey) => void;
}

export const PokemonSelect: React.FC<PokemonSelectProps> = ({ onSelect }) => {
	const [selected, setSelected] = useState<PokemonKey | "">("");
	const [level, setLevel] = useState<number>(1);
	const [selectedNature, setSelectedNature] = useState<NatureKey | "">("");
	const [evs, setEvs] = useState<Record<StatKey, number>>(
		statKeys.reduce(
			(acc, k) => ({ ...acc, [k]: 0 }),
			{} as Record<StatKey, number>
		)
	);
	const [ivs, setIvs] = useState<Record<StatKey, number>>(
		statKeys.reduce(
			(acc, k) => ({ ...acc, [k]: 0 }),
			{} as Record<StatKey, number>
		)
	);

	const entries = Object.entries(Pokedex) as [
		PokemonKey,
		(typeof Pokedex)[PokemonKey]
	][];
	entries.sort(([, a], [, b]) => a.num - b.num);

	const natureEntries = Object.entries(Natures) as [
		NatureKey,
		(typeof Natures)[NatureKey]
	][];
	natureEntries.sort(([, a], [, b]) => a.name.localeCompare(b.name));

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const key = e.target.value as PokemonKey;
		setSelected(key);
		onSelect?.(key);
	};
	const handleEvChange =
		(key: StatKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
			setEvs((prev) => ({
				...prev,
				[key]: Math.max(0, Math.min(252, +e.target.value)),
			}));
	const handleIvChange =
		(key: StatKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
			setIvs((prev) => ({
				...prev,
				[key]: Math.max(0, Math.min(31, +e.target.value)),
			}));

	const selectedPokemon = selected ? Pokedex[selected] : null;
	const nature = selectedNature ? Natures[selectedNature] : null;

	const statRows: { label: string; key: StatKey }[] = [
		{ label: "HP", key: "hp" },
		{ label: "Attack", key: "atk" },
		{ label: "Defense", key: "def" },
		{ label: "Sp. Atk", key: "spa" },
		{ label: "Sp. Def", key: "spd" },
		{ label: "Speed", key: "spe" },
	];

	return (
		<div>
			<select
				value={selected}
				onChange={handleChange}
				className="form-select mb-3"
			>
				<option value="" disabled>
					— Select a Pokémon —
				</option>
				{entries.map(([key, { name }]) => (
					<option key={key} value={key}>
						{name}
					</option>
				))}
			</select>

			{selectedPokemon && (
				<div className="card">
					<div className="card-header">{selectedPokemon.name}</div>
					<div className="card-body">
						<div className="row mb-3">
							<div className="col">
								<label className="form-label">Level</label>
								<input
									type="number"
									className="form-control"
									min={1}
									max={100}
									value={level}
									onChange={(e) => setLevel(+e.target.value)}
								/>
							</div>
							<div className="col">
								<label className="form-label">Nature</label>
								<select
									className="form-select"
									value={selectedNature}
									onChange={(e) =>
										setSelectedNature(e.target.value as NatureKey)
									}
								>
									<option value="" disabled>
										— Select Nature —
									</option>
									{natureEntries.map(([key, { name }]) => (
										<option key={key} value={key}>
											{name}
										</option>
									))}
								</select>
							</div>
						</div>

						<table className="table">
							<thead>
								<tr>
									<th>Stat</th>
									<th>Base</th>
									<th>EVs</th>
									<th>IVs</th>
									<th>Actual</th>
								</tr>
							</thead>
							<tbody>
								{statKeys.map((key) => (
									<tr key={key}>
										<td>{key.toUpperCase()}</td>
										<td>{selectedPokemon.baseStats[key]}</td>
										<td>
											<input
												type="number"
												className="form-control form-control-sm"
												value={evs[key]}
												onChange={handleEvChange(key)}
											/>
										</td>
										<td>
											<input
												type="number"
												className="form-control form-control-sm"
												value={ivs[key]}
												onChange={handleIvChange(key)}
											/>
										</td>
										<td>
											{calculateStat(
												selectedPokemon.baseStats[key],
												ivs[key],
												evs[key],
												level,
												key === "hp",
												nature,
												key
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
