import React, { useState, useRef, useEffect } from 'react'
import { Modal, Upload, Button, Slider, Space, message, Typography, Divider } from 'antd'
import {
  UploadOutlined,
  ZoomInOutlined,
  RotateRightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const { Text, Title } = Typography

interface PhotoUploadModalProps {
  open: boolean
  onClose: () => void
  onSave: (file: File) => Promise<void>
  currentImageUrl?: string
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  open,
  onClose,
  onSave,
  currentImageUrl,
}) => {
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [crop, setCrop] = useState<Crop>()
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const initialStateRef = useRef({ zoom: 1, rotation: 0, crop: null })

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const initialCrop = centerAspectCrop(width, height, 1)
    setCrop(initialCrop)
    if (!initialStateRef.current.crop) {
      initialStateRef.current.crop = initialCrop
    }
  }

  useEffect(() => {
    if (open) {
      initialStateRef.current = { zoom: 1, rotation: 0, crop: null }
      setHasChanges(false)
      setZoom(1)
      setRotation(0)
    }
  }, [open])

  useEffect(() => {
    if (selectedFile) {
      setHasChanges(true)
      return
    }

    const hasZoomChange = zoom !== initialStateRef.current.zoom
    const hasRotationChange = rotation !== initialStateRef.current.rotation
    const hasCropChange =
      initialStateRef.current.crop &&
      crop &&
      (crop.x !== initialStateRef.current.crop.x ||
        crop.y !== initialStateRef.current.crop.y ||
        crop.width !== initialStateRef.current.crop.width ||
        crop.height !== initialStateRef.current.crop.height)

    setHasChanges(hasZoomChange || hasRotationChange || hasCropChange)
  }, [selectedFile, zoom, rotation, crop])

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!')
      return false
    }

    const isLt2M = file.size <= MAX_FILE_SIZE
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
      return false
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    setSelectedFile(file)
    return false
  }

  const processImage = async (imageElement: HTMLImageElement, sourceUrl: string) => {
    if (!crop) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Get the original dimensions
    const scaleX = imageElement.naturalWidth / imageElement.width
    const scaleY = imageElement.naturalHeight / imageElement.height

    // Calculate the crop dimensions in the original image scale
    const cropWidth = crop.width * scaleX
    const cropHeight = crop.height * scaleY
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    // Set final dimensions based on crop
    canvas.width = cropWidth
    canvas.height = cropHeight

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Handle rotation if needed
    if (rotation > 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)
    }

    // Draw the image considering the crop area
    ctx.drawImage(imageElement, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

    return new Promise<File>(resolve => {
      canvas.toBlob(
        blob => {
          if (blob) {
            const fileName = selectedFile?.name || 'modified-image.jpg'
            const mimeType = selectedFile?.type || 'image/jpeg'
            resolve(new File([blob], fileName, { type: mimeType }))
          }
        },
        selectedFile?.type || 'image/jpeg',
        1
      )
    })
  }

  const handleSave = async () => {
    if (!imageRef.current || !crop) return

    setLoading(true)
    try {
      const activeImage = previewUrl || currentImageUrl
      if (!activeImage) return

      const file = await processImage(imageRef.current, activeImage)
      if (file) {
        await onSave(file)
        handleClose()
      }
    } catch (error) {
      message.error('Failed to process image')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setCrop(undefined)
    setZoom(1)
    setRotation(0)
    setHasChanges(false)
    onClose()
  }

  const activeImage = previewUrl || currentImageUrl

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          Upload Clinic Photo
        </Title>
      }
      open={open}
      width={800}
      onCancel={handleClose}
      centered
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
          disabled={!hasChanges || !crop}
        >
          Save
        </Button>,
      ]}
    >
      <div className="space-y-4">
        {activeImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Photo Preview Section */}
            <div className="lg:col-span-8">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="max-w-[320px] mx-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={c => setCrop(c)}
                    aspect={1}
                    className="rounded-lg overflow-hidden"
                  >
                    <img
                      ref={imageRef}
                      src={activeImage}
                      alt="Preview"
                      onLoad={onImageLoad}
                      style={{
                        maxWidth: '100%',
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="lg:col-span-4">
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <Text strong className="block mb-2">
                      Zoom
                    </Text>
                    <div className="flex items-center space-x-3">
                      <ZoomInOutlined className="text-gray-400" />
                      <Slider
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={zoom}
                        onChange={setZoom}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Text strong className="block mb-2">
                      Rotation
                    </Text>
                    <div className="flex items-center space-x-3">
                      <RotateRightOutlined className="text-gray-400" />
                      <Slider
                        min={0}
                        max={360}
                        value={rotation}
                        onChange={setRotation}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <Divider className="my-3" />

                <div className="flex items-start space-x-2">
                  <InfoCircleOutlined className="text-blue-400 mt-1 flex-shrink-0" />
                  <Text type="secondary" className="text-sm">
                    Drag the corners to crop your image. Use the sliders to adjust zoom and
                    rotation.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <Text type="secondary">No image selected</Text>
            <Text type="secondary" className="text-sm mt-2">
              Select an image to start editing
            </Text>
          </div>
        )}

        <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
          <InfoCircleOutlined className="text-gray-400 mt-1 flex-shrink-0" />
          <Text type="secondary" className="text-sm">
            Accepted formats: JPG, PNG. Maximum file size: 2MB. For best results, use a square image
            with minimum dimensions of 400x400 pixels.
          </Text>
        </div>

        <div className="flex justify-center">
          <Upload accept="image/jpeg,image/png" showUploadList={false} beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />} type="primary" size="large">
              Select Image
            </Button>
          </Upload>
        </div>
      </div>
    </Modal>
  )
}

export default PhotoUploadModal
