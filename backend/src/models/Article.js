import mongoose from "mongoose";
import { Comment } from "./Comment.js";

const articleSchema = new mongoose.Schema(
    {
        titre: {
            type: String,
            required: [true, "Le titre est obligatoire"],
            trim: true,
            minLength: [3, "Le titre doit contenir au moins 3 caractères"],
            maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
        },
        contenu: {
            type: String,
            required: [true, "Le contenu est obligatoire"],
            trim: true,
            minLength: [10, "Le contenu doit contenir au moins 10 caractères"],
        },
        auteur: {
            type: String,
            required: [true, "L'auteur est obligatoire"],
        },
        auteurId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "L'identifiant auteur est obligatoire"],
        },
        categorie: {
            type: String,
            required: [true, "La catégorie est obligatoire"],
            enum: ["Villageois", "Décoration", "Faune", "Actualités du jeu"],
        },
        statut: {
            type: String,
            enum: ["brouillon", "publié"],
            default: "publié",
        },
        publie: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
        vues: {
            type: Number,
            default: 0,
            min: [0, "Le nombre de vues ne peut pas être négatif"],
        },
        createdAt: {
            type: Date,
        },
        updatedAt: {
            type: Date,
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

articleSchema.statics.getCategorieIcon = function (categorie) {
    const iconMap = {
        "Villageois": "/img/icons/icon-villageois.svg",
        "Décoration": "/img/icons/icon-decoration.svg",
        "Faune": "/img/icons/icon-faune.svg",
        "Actualités du jeu": "/img/icons/icon-actualites.svg",
    };
    return iconMap[categorie];
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

articleSchema.pre("findOneAndDelete", async function (next) {
    const articleId = this.getQuery()._id;
    if (articleId) {
        await Comment.deleteMany({ article: articleId });
    }
    next();
});

export const Article = mongoose.model("Article", articleSchema);
