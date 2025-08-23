'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  X,
  Save,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  Tag,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Image from 'next/image';

import { showApiError, showApiSuccess } from '@/lib/api';
import { productsAPI } from '@/services/productsAPI';

// Interface para o produto
interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  tags?: string;
  status: 'draft' | 'active' | 'inactive' | 'sold';
  imageUrl?: string;
}

// Schema de validação
const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título muito longo'),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, 'Preço é obrigatório')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Preço deve ser um número maior que zero'
    ),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'active', 'inactive', 'sold']).default('draft'),
});

type ProductFormData = z.infer<typeof productSchema>;

// Componente de upload de imagem
function ImageUpload({
  imageUrl,
  onImageChange,
  onImageRemove,
}: {
  imageUrl: string | null;
  onImageChange: (url: string) => void;
  onImageRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showApiError('Arquivo muito grande. Máximo 10MB.');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showApiError('Tipo de arquivo não suportado. Use JPG, PNG ou WebP.');
        return;
      }

      setUploading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const fakeUrl = `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=800&h=600&fit=crop`;
        onImageChange(fakeUrl);
        showApiSuccess('Imagem enviada com sucesso!');
      } catch (error) {
        showApiError('Erro ao enviar imagem');
      } finally {
        setUploading(false);
      }
    },
    [onImageChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Imagem do produto
      </label>
      {imageUrl ? (
        <div className="relative">
          <Image
            src={imageUrl}
            alt="Preview"
            width={800}
            height={600}
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
            style={{
              width: '100%',
              height: '16rem',
              objectFit: 'cover',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
            priority
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-sm text-gray-600">Enviando imagem...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {isDragActive
                  ? 'Solte a imagem aqui'
                  : 'Clique ou arraste uma imagem'}
              </p>
              <p className="text-sm text-gray-500">PNG, JPG ou WebP até 10MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente de editor de texto rico simples
function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isPreview, setIsPreview] = useState(false);

  const formatText = (command: string) => {
    const textarea = document.getElementById(
      'description'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let formattedText = '';
    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = selectedText
          .split('\n')
          .map((line) => `- ${line}`)
          .join('\n');
        break;
      case 'link':
        formattedText = `[${selectedText}](URL)`;
        break;
      default:
        return;
    }

    const newValue =
      value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
  };

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-primary-600 hover:underline">$1</a>'
      )
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('<li>')) {
          return `<ul class="list-disc list-inside mb-2">${line}</ul>`;
        }
        return line ? `<p class="mb-2">${line}</p>` : '<br>';
      })
      .join('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {isPreview ? (
            <FileText className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span>{isPreview ? 'Editar' : 'Visualizar'}</span>
        </button>
      </div>

      {!isPreview && (
        <div className="border border-gray-300 rounded-lg">
          <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Negrito"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Itálico"
            >
              <em>I</em>
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => formatText('list')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Lista"
            >
              • Lista
            </button>
            <button
              type="button"
              onClick={() => formatText('link')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Link"
            >
              🔗
            </button>
          </div>
          <textarea
            id="description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className="w-full p-3 border-0 focus:ring-0 resize-none"
            placeholder="Descreva seu produto... Use **negrito**, *itálico*, listas e links para destacar informações importantes."
          />
        </div>
      )}

      {isPreview && (
        <div className="border border-gray-300 rounded-lg p-3 bg-white min-h-[120px]">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        </div>
      )}
    </div>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = params.id as string;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Buscar dados do produto
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product | undefined>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const result = await productsAPI.getProduct(productId);
      // If the API returns null or a product missing required fields, return undefined
      if (
        !result ||
        typeof result !== 'object' ||
        !('id' in result) ||
        !('title' in result) ||
        !('price' in result) ||
        !('status' in result)
      ) {
        return undefined;
      }
      return result as Product;
    },
    enabled: !!productId,
  });

  // Preencher formulário quando os dados chegarem
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description || '',
        price: product.price.toString(),
        category: product.category || '',
        tags: product.tags || '',
        status: product.status,
      });
      setImageUrl(product.imageUrl || null);
    }
  }, [product, reset]);

  // Atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      productsAPI.update(productId, {
        ...data,
        imageUrl: imageUrl || undefined,
      }),
    onSuccess: () => {
      showApiSuccess('Produto atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      router.push(`/products/${productId}`);
    },
    onError: (error) => {
      showApiError(error);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    updateProductMutation.mutate(data);
  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
  };

  const handleImageRemove = () => {
    setImageUrl(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Produto não encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            O produto que você está tentando editar não existe ou foi removido.
          </p>
          <Link
            href="/products"
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos produtos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/products/${productId}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar produto</h1>
            <p className="text-gray-600 mt-1">
              Atualize as informações do seu produto
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Informações básicas
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do produto *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: iPhone 13 Pro Max 256GB"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('price')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0,00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <input
                    type="text"
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Eletrônicos, Roupas, Casa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: novo, seminovo, garantia"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separe as tags por vírgula
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Descrição
              </h2>

              <RichTextEditor
                value={watch('description') || ''}
                onChange={(value) => setValue('description', value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Imagem
              </h2>

              <ImageUpload
                imageUrl={imageUrl}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Status
              </h2>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="draft"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span className="text-sm">Rascunho</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="active"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span className="text-sm">Ativo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="inactive"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span className="text-sm">Inativo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="sold"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span className="text-sm">Vendido</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ações
              </h2>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                  </span>
                </button>

                <Link
                  href={`/products/${productId}`}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center block"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
