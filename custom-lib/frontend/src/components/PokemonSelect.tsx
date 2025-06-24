// src/components/PokemonSelect.tsx
import React, { useState } from "react";
import { Pokedex } from "../../../../data/pokedex";
import { Natures } from "../../../../data/natures";

type PokemonKey = keyof typeof Pokedex;
type StatKey = keyof (typeof Pokedex)[PokemonKey]["baseStats"];

interface PokemonSelectProps {
	onSelect?: (pokemonKey: PokemonKey) => void;
}

export const PokemonSelect: React.FC<PokemonSelectProps> = ({ onSelect }) => {
	const [selected, setSelected] = useState<PokemonKey | "">("");
	const [level, setLevel] = useState<number>(1);
	const [selectedNature, setSelectedNature] = useState<NatureKey | "">("");

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

	const selectedPokemon = selected ? Pokedex[selected] : null;

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
				className="form-select"
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
				<div className="card mt-3">
					<div className="card-header">{selectedPokemon.name}</div>
					<div className="card-body">
						<div className="mb-3">
							<label className="form-label">Level</label>
							<input
								type="number"
								className="form-control"
								min={1}
								max={100}
								value={level}
								onChange={(e) => setLevel(Number(e.target.value))}
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
								{statRows.map(({ label, key }) => (
									<tr key={key}>
										<td>{label}</td>
										<td>{selectedPokemon.baseStats[key]}</td>
										<td>
											<input
												type="number"
												className="form-control form-control-sm"
											/>
										</td>
										<td>
											<input
												type="number"
												className="form-control form-control-sm"
											/>
										</td>
										<td></td>
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
