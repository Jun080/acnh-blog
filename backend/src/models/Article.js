import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
    {
        titre: {
            type: String,
            required: [true, "Le titre est obligatoire"],
            trim: true,
            maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
        },
        contenu: {
            type: String,
            required: [true, "Le contenu est obligatoire"],
            trim: true,
        },
        auteur: {
            type: String,
            ref: "User",
            required: [true, "L'auteur est obligatoire"],
        },
        publie: {
            type: Boolean,
            default: false,
        },
        publieLe: {
            type: Date,
        },
        categorie: {
            type: String,
            enum: ["Technologie", "Santé", "Finance", "Éducation", "Divertissement"],
        },
        vues: {
            type: Number,
            default: 0,
            min: [0, "Le nombre de vues ne peut pas être négatif"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

articleSchema.methods.publier = function () {
    this.publie = true;
    return this.save();
};

articleSchema.methods.depublier = function () {
    this.publie = false;
    return this.save();
};

articleSchema.methods.incrementerVues = function () {
    this.vues += 1;
    return this.save();
};

articleSchema.statics.findPublies = function () {
    return this.find({ publie: true }).sort({ createdAt: -1 });
};

articleSchema.virtual("resume").get(function () {
    if (this.contenu.length <= 150) {
        return this.contenu;
    }
    return this.contenu.substring(0, 147) + "...";
});

articleSchema.pre("save", function (next) {
    console.log(`Sauvegarde de l'article: ${this.titre}`);
    next();
});

articleSchema.post("save", function (doc) {
    console.log(`Article sauvegardé: ${doc._id}`);
});

export const Article = mongoose.model("Article", articleSchema);
