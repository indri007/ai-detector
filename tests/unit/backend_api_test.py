"""
Unit tests for Python backend core NLP & Similarity logic
"""
from backend.nlp_engine import analyze_grammar_rules, calculate_similarity_shingles

def test_indonesian_puebi_rules():
    sample = "Dalam praktek laboratorium, kami menguji sampel di mana air mengalir."
    findings = analyze_grammar_rules(sample, "id-ID")
    
    rule_ids = [f["rule_id"] for f in findings]
    assert "ID_SPELL_PRAKTEK" in rule_ids, "Should detect 'praktek'"
    assert "ID_DI_MANA_RELATIF" in rule_ids, "Should detect 'di mana'"
    print("✓ test_indonesian_puebi_rules passed")

def test_english_academic_contractions():
    sample = "The researchers don't believe that this is the best approach."
    findings = analyze_grammar_rules(sample, "en-US")
    
    rule_ids = [f["rule_id"] for f in findings]
    assert "EN_ACADEMIC_CONTRACTION" in rule_ids, "Should detect 'don't'"
    print("✓ test_english_academic_contractions passed")

def test_similarity_calculation():
    sample = (
        "The dominant sequence transduction models are based on complex recurrent or "
        "convolutional neural networks that include an encoder and a decoder."
    )
    res = calculate_similarity_shingles(sample)
    assert res["overall_percent"] > 0, "Similarity should be > 0% for Vaswani quote"
    assert len(res["matched_sources"]) > 0, "Should match Vaswani source"
    print("✓ test_similarity_calculation passed")

if __name__ == "__main__":
    test_indonesian_puebi_rules()
    test_english_academic_contractions()
    test_similarity_calculation()
    print("\nALL PYTHON BACKEND LOGIC TESTS PASSED!")
