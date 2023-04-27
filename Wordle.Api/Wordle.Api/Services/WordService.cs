using Wordle.Api.Data;

namespace Wordle.Api.Services
{
    public class WordService
    {
        private readonly AppDbContext _context;

        public WordService(AppDbContext context)
        {
            _context = context;
        }

        public Word GetWord()
        {
            int wordCount = _context.Words.Count(f => f.IsCommon);
            int randomIndex = new Random().Next(0, wordCount);
            Word chosenWord = _context.Words
                .Where(f => f.IsCommon)
                .OrderBy(w => w.WordId)
                .Skip(randomIndex)
                .Take(1)
                .First();
            return chosenWord;
        }
    }
}
