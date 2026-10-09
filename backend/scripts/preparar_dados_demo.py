"""Converte o CSV fornecido para o JSON usado pelo frontend sem banco."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'backend' / 'data' / 'ubs_recife.csv'
DESTINATION = ROOT / 'frontend' / 'src' / 'data' / 'ubs_recife_demo.json'


def title_bairro(value):
    return ' '.join(word.lower() if index and word.lower() in {'da', 'de', 'do', 'das', 'dos'} else word.capitalize()
                    for index, word in enumerate(value.split()))


def read_units(path=SOURCE):
    with path.open(encoding='utf-8-sig', newline='') as file:
        reader = csv.DictReader(file, delimiter=';')
        required = {'nome_oficial', 'endereço', 'bairro', 'fone', 'horario', 'latitude', 'longitude', 'cnes'}
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            raise ValueError('CSV não contém as colunas esperadas da base de UBSs.')
        units = []
        seen = set()
        for number, row in enumerate(reader, 2):
            try:
                cnes = row['cnes'].strip()
                latitude = float(row['latitude'].strip())
                longitude = float(row['longitude'].strip())
                if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                    raise ValueError('coordenadas fora do intervalo')
                if not cnes or cnes in seen:
                    raise ValueError('CNES vazio ou repetido')
                for key in ('nome_oficial', 'endereço', 'bairro'):
                    if not row[key].strip():
                        raise ValueError(f'{key} vazio')
            except (KeyError, TypeError, ValueError) as error:
                raise ValueError(f'Linha {number}: {error}') from error
            seen.add(cnes)
            units.append({
                'id': cnes,
                'cnes': cnes,
                'nome': row['nome_oficial'].strip(),
                'endereco': row['endereço'].strip(),
                'bairro': title_bairro(row['bairro'].strip()),
                'cep': '',
                'telefone': row['fone'].strip(),
                'horario_funcionamento': row['horario'].strip(),
                'especialidade': row.get('especialidade', '').strip(),
                'como_usar': row.get('como_usar', '').strip(),
                'rpa': row.get('rpa', '').strip(),
                'latitude': latitude,
                'longitude': longitude,
                'ativa': True,
            })
    return units


if __name__ == '__main__':
    units = read_units()
    DESTINATION.write_text(json.dumps(units, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(units)} UBSs gravadas em {DESTINATION}')
