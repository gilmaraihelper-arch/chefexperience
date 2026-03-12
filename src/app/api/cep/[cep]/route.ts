import { NextRequest, NextResponse } from 'next/server';
import { consultarCep, buscarCoordenadasPorCep } from '@/lib/geolocation';

/**
 * GET /api/cep/[cep]
 * Consulta dados de um CEP brasileiro
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cep: string }> }
) {
  try {
    const { cep } = await params;

    if (!cep) {
      return NextResponse.json(
        { error: 'CEP não informado' },
        { status: 400 }
      );
    }

    // Consulta dados do CEP
    const endereco = await consultarCep(cep);

    if (!endereco) {
      return NextResponse.json(
        { error: 'CEP não encontrado' },
        { status: 404 }
      );
    }

    // Opcional: buscar coordenadas se tiver Google API key
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    let coordenadas = null;

    if (googleApiKey) {
      coordenadas = await buscarCoordenadasPorCep(cep, googleApiKey);
    }

    return NextResponse.json({
      success: true,
      data: {
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.localidade,
        estado: endereco.uf,
        ibge: endereco.ibge,
        ddd: endereco.ddd,
        coordenadas,
      },
    });
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar CEP' },
      { status: 500 }
    );
  }
}
