using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wordle.Api.Services;

namespace Wordle.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordController : ControllerBase
    {
        WordService _wordService;

        public WordController(WordService wordService)
        {
            _wordService = wordService;
        }
        
        [HttpGet]
        public ActionResult<string> Get()
        {
            return _wordService.GetWord().Text;
        }
    }
}
