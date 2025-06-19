import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(value)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true)
      const file = acceptedFiles[0]
      
      if (!file) return
      
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `vehicle-images/${fileName}`

      // Upload para o Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('vehicles')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath)

      setPreview(publicUrl)
      onChange(publicUrl)

    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      onError?.('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }, [onChange, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const removeImage = () => {
    setPreview(undefined)
    onChange('')
  }

  return (
    <div className="space-y-4 w-full">
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-4 cursor-pointer
          transition-colors duration-200 ease-in-out
          flex flex-col items-center justify-center
          min-h-[200px]
          ${isDragActive ? 'border-[#E95440] bg-[#E95440]/5' : 'border-gray-300 hover:border-[#E95440]'}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-2" />
            <p>Fazendo upload...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full min-h-[200px]">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeImage()
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="p-4 rounded-full bg-gray-50 mb-4">
              {isDragActive ? (
                <Upload className="w-8 h-8" />
              ) : (
                <ImageIcon className="w-8 h-8" />
              )}
            </div>
            <p className="text-sm font-medium mb-1">
              {isDragActive ? 'Solte a imagem aqui' : 'Arraste uma imagem ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG ou WEBP (max. 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 