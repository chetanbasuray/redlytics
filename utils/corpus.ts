// A set of common English "stop words" to be filtered out during text analysis.
export const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
    'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don', 'don\'t', 'down', 'during', 'each',
    'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
    'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d',
    'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more',
    'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',

    'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
    'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
    'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through',
    'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were',
    'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom',
    'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your',
    'yours', 'yourself', 'yourselves', 'im', 'like', 'just', 'get', 'got', 'also', 'really', 'one', 'even', 'people',
    'think', 'see', 'know', 'would', 'could', 'good', 'still', 'make', 'things', 'thing', 'that', 'this', 'and', 'but'
]);

// A pre-calculated map of Inverse Document Frequency (IDF) scores for common English words.
// Lower scores mean the word is more common. Used for TF-IDF analysis.
// Source: Simplified from various English language corpora.
export const IDF_CORPUS: Record<string, number> = {
    'time': 1.8, 'person': 2.2, 'year': 2.3, 'way': 2.4, 'day': 2.5, 'man': 2.8, 'world': 2.9, 'life': 3.0,
    'hand': 3.1, 'part': 3.2, 'child': 3.3, 'eye': 3.4, 'woman': 3.5, 'place': 3.6, 'work': 3.7, 'week': 3.8,
    'case': 3.9, 'point': 4.0, 'government': 4.1, 'company': 4.2, 'number': 4.3, 'group': 4.4, 'problem': 4.5,
    'fact': 4.6, 'people': 2.0, 'history': 4.7, 'art': 4.8, 'war': 4.9, 'money': 5.0, 'story': 5.1, 'game': 5.2,
    'power': 5.3, 'law': 5.4, 'water': 5.5, 'health': 5.6, 'music': 5.7, 'book': 5.8, 'science': 5.9,
    'love': 4.5, 'friend': 5.5, 'family': 4.8, 'job': 5.1, 'country': 5.2, 'city': 5.4, 'school': 5.3,
    'food': 5.6, 'car': 5.8, 'computer': 6.2, 'internet': 6.0, 'phone': 6.1, 'movie': 5.7, 'team': 5.9,
    'system': 5.0, 'program': 6.1, 'question': 5.2, 'answer': 5.5, 'home': 4.9, 'room': 5.6, 'mother': 5.7,
    'father': 5.8, 'business': 5.3, 'market': 5.8, 'student': 6.0, 'teacher': 6.2, 'president': 6.1,
    'news': 5.4, 'show': 5.1, 'service': 5.5, 'product': 6.0, 'idea': 5.3, 'body': 5.6, 'mind': 5.9,
    'information': 5.1, 'community': 5.7, 'role': 5.4, 'reason': 5.2, 'result': 5.3, 'moment': 5.8, 'research': 6.2,
    'design': 6.3, 'technology': 6.5, 'politics': 6.4, 'economy': 6.6, 'culture': 6.3, 'nature': 6.1,
    'society': 5.9, 'language': 6.5, 'code': 7.0, 'software': 7.2, 'hardware': 7.5, 'network': 6.8, 'data': 6.4,
    'analysis': 6.9, 'algorithm': 8.0, 'interface': 7.6, 'framework': 7.8, 'database': 7.7, 'server': 7.4,
    'client': 7.5, 'security': 7.1, 'privacy': 7.3, 'crypto': 8.2, 'blockchain': 8.5, 'machine': 6.7,
    'learning': 6.8, 'model': 6.5, 'training': 6.9, 'neural': 8.1, 'deep': 7.0, 'intelligence': 7.2,
    'artificial': 7.5, 'philosophy': 7.9, 'psychology': 7.6, 'sociology': 7.8, 'biology': 7.4, 'chemistry': 7.7,
    'physics': 7.5, 'mathematics': 7.8, 'quantum': 8.8, 'relativity': 8.9, 'universe': 8.3, 'galaxy': 8.6,
    'planet': 8.4, 'star': 8.2, 'space': 7.1, 'environment': 6.9, 'climate': 7.3, 'change': 5.5, 'sustainability': 8.1,
    'energy': 6.7, 'policy': 6.6, 'election': 7.0, 'campaign': 7.2, 'vote': 6.8, 'democracy': 7.4, 'freedom': 6.9,
    'justice': 7.1, 'rights': 6.5, 'human': 5.8, 'character': 6.2, 'emotion': 6.8, 'feeling': 6.4,
};