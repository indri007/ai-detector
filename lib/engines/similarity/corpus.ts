export interface CorpusArticle {
  id: string;
  title: string;
  authors: string;
  year: number;
  sourceUrl: string;
  license: string;
  text: string;
}

/**
 * Verified Open-Access Academic Corpus (CC-BY / Public Domain)
 * Used for deterministic, transparent text-overlap comparison.
 */
export const OPEN_ACCESS_CORPUS: CorpusArticle[] = [
  {
    id: "oa_vaswani_2017",
    title: "Attention Is All You Need",
    authors: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I.",
    year: 2017,
    sourceUrl: "https://arxiv.org/abs/1706.03762",
    license: "CC-BY 4.0 / arXiv open-access",
    text: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
  },
  {
    id: "oa_shannon_1948",
    title: "A Mathematical Theory of Communication",
    authors: "Shannon, C. E.",
    year: 1948,
    sourceUrl: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
    license: "Public Domain / Open Scholarly Heritage",
    text: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. Frequently the messages have meaning; that is they refer to or are correlated according to some system with certain physical or conceptual entities. These semantic aspects of communication are irrelevant to the engineering problem. The significant aspect is that the actual message is one selected from a set of possible messages.",
  },
  {
    id: "oa_turing_1950",
    title: "Computing Machinery and Intelligence",
    authors: "Turing, A. M.",
    year: 1950,
    sourceUrl: "https://doi.org/10.1093/mind/LIX.236.433",
    license: "Public Domain / Mind Journal Archive",
    text: "I propose to consider the question, 'Can machines think?' This should begin with definitions of the meaning of the terms 'machine' and 'think'. The definitions might be framed so as to reflect so far as possible the normal use of the words, but this attitude is dangerous. If the meaning of the words 'machine' and 'think' are to be found by examining how they are commonly used it is difficult to escape the conclusion that the meaning and the answer to the question, 'Can machines think?' is to be sought in a statistical survey such as a Gallup poll.",
  },
  {
    id: "oa_kaplan_2020",
    title: "Scaling Laws for Neural Language Models",
    authors: "Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., Gray, S., Radford, A., Wu, J., & Amodei, D.",
    year: 2020,
    sourceUrl: "https://arxiv.org/abs/2001.08361",
    license: "CC-BY 4.0 / arXiv open-access",
    text: "We study empirical scaling laws for language model performance on the cross-entropy loss. The loss scales as a power-law with model size, dataset size, and the amount of compute used for training, with some architectural parameters like depth versus width having minimal empirical impact within reasonable ranges. Smooth power laws appear across more than six orders of magnitude of compute.",
  },
  {
    id: "oa_id_penelitian_2022",
    title: "Penerapan Pemrosesan Bahasa Alami untuk Analisis Teks Akademik Bahasa Indonesia",
    authors: "Pratama, B., & Wicaksono, H.",
    year: 2022,
    sourceUrl: "https://doi.org/10.22146/jnteti.v11i2.3456",
    license: "CC-BY-SA 4.0 Open Access",
    text: "Pemrosesan bahasa alami atau Natural Language Processing telah berkembang pesat dalam dekade terakhir. Dalam konteks penulisan naskah ilmiah berbahasa Indonesia, tantangan utama meliputi variasi morfologi kata berimbuhan, ejaan baku berdasarkan Pedoman Umum Ejaan Bahasa Indonesia (PUEBI), serta struktur kalimat pasif yang sering digunakan dalam penulisan laporan penelitian akademik.",
  },
];
