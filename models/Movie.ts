import mongoose, { Schema, type Document } from "mongoose"

export interface IMovie extends Document {
  titleEnglish: string
  titleArabic: string
  year: number
  budget?: number
  plotEnglish: string
  plotArabic: string
  genres: mongoose.Types.ObjectId[]
  director?: mongoose.Types.ObjectId
  writers?: mongoose.Types.ObjectId[]
  cast?: mongoose.Types.ObjectId[]
  language?: mongoose.Types.ObjectId
  quality?: mongoose.Types.ObjectId
  poster?: string
  cover?: string
  rating?: number
  videos: Array<{
    title: string
    url: string
    isTrailer: boolean
  }>
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
}

const MovieSchema = new Schema<IMovie>({
  titleEnglish: { type: String, required: true },
  titleArabic: { type: String, required: true },
  year: { type: Number, required: true },
  budget: { type: Number },
  plotEnglish: { type: String, required: true },
  plotArabic: { type: String, required: true },
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  director: { type: Schema.Types.ObjectId, ref: "User" },
  writers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  cast: [{ type: Schema.Types.ObjectId, ref: "User" }],
  language: { type: Schema.Types.ObjectId, ref: "Language" },
  quality: { type: Schema.Types.ObjectId, ref: "Quality" },
  poster: { type: String },
  cover: { type: String },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  videos: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      isTrailer: { type: Boolean, default: false },
    },
  ],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create text index for search
MovieSchema.index({ titleEnglish: "text", titleArabic: "text", plotEnglish: "text", plotArabic: "text" })

export default mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema)

